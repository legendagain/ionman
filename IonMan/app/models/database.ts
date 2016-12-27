import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Question } from './question';
import { Level } from './level';

declare var require: any;
var loki = require('lokijs');
var localForage = require('localforage');
var _ = require('underscore');

declare var cordova: any;

export class Database {
    static dbKey: string = "ion-man";
    static db: any;
    public static questions: any;
    public static levels: any;

    static init(http: Http) {
        // initialize the database
        this.db = new loki('ionman.db');
        // this.deleteAll();    -- uncomment for testing
        this.questions = this.db.addCollection('questions');
        this.levels = this.db.addCollection('levels');

        this.loadDatabase(() => {
            if (!this.questions.data.length)
                this.importData(http);
        });
    }

    private static importData(http: Http) {
        var fileName = 'build/assets/data.json';
        http.get(fileName).map((response: Response) =>
            response.json()
        ).subscribe(data => {
            // clears database before populating with new data
            this.deleteAll();

            // populates questions
            if (data.questions) {
                for (let question of data.questions) {
                    this.questions.insert(question);
                }
            }

            // populates level
            if (data.levels && data.levels.length) {
                for (let level of data.levels) {
                    level.unlocked = false;
                    this.levels.insert(level);
                }
            }
            this.levels.data[0].unlocked = true;

            // commits changes to database
            this.saveAll();
        }, error => {
            var errMsg = error.message || error.toString();
            return Observable.throw(errMsg);
        });
    }

    static saveAll() {
        localForage.setItem(Database.dbKey, JSON.stringify(this.db)).then(function (value) {
            console.log('database successfully saved');
        }).catch(function (err) {
            console.log('error while saving: ' + err);
        });
    }

    static loadDatabase(importCallback: () => void = null) {
        var self = this;
        localForage.getItem(Database.dbKey).then(function (value) {
            console.log('Successfully loaded database.');
            if (value) {
                self.db.loadJSON(value);
                self.questions = self.db.getCollection('questions');
                self.levels = self.db.getCollection('levels');
            }

            if (importCallback)
                importCallback();
        }).catch(function (err) {
            console.log('Error loading database: ' + err);
        });
    }

    static deleteAll() {
        localForage.setItem(Database.dbKey, null).then(function (value) {
            console.log('database successfully deleted');
        }).catch(function (err) {
            console.log('error while deleting: ' + err);
        });
    }

    static getNextLevel(difficulty: string, level: number): Level {
        var isNext = false;
        for (let e of _.sortBy(this.levels.data, 'index')) {
            if (isNext)
                return e;
            if (e.difficulty == difficulty && e.number == level) {
                isNext = true;
            }
        }

        return null;
    }
}