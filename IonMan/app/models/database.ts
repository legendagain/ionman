import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Question } from './question';

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
        //this.deleteAll();
        this.questions = this.db.addCollection('questions');
        this.levels = this.db.addCollection('levels');

        this.importAll(() => {
            if (!this.questions.data.length)
                this.loadData(http);
        });
        /*
        if (!this.questions.data.length) {
            var questions: Question[] = [
                // nouns
                new Question('hello', 'sabaidee', 'Beginner', 1, 'noun'),
                new Question('bye-bye', 'lakon', 'Beginner', 1, 'noun'),
                new Question('Laotian', 'khon lao', 'Beginner', 1, 'noun'),
                new Question('house', 'baan', 'Beginner', 1, 'noun'),
                new Question('fried rice', 'khaaw phad', 'Beginner', 1, 'noun'),
                new Question('food', 'aahaan', 'Beginner', 1, 'noun'),
                new Question('teacher', 'ajaan', 'Beginner', 1, 'noun'),
                new Question('book', 'nangsuu', 'Beginner', 1, 'noun'),
                // adjectives
                new Question('beautiful', 'ngarm', 'Beginner', 1, 'adjective'),
                new Question('fat', 'dui', 'Beginner', 1, 'adjective'),
                new Question('dark', 'dum', 'Beginner', 1, 'adjective'),
                new Question('good', 'keng', 'Beginner', 1, 'adjective'),
                // verbs
                new Question('study', 'rian', 'Beginner', 2, 'adjective'),
                new Question('go', 'pai', 'Beginner', 2, 'adjective'),
                new Question('sleep', 'norn lup', 'Beginner', 2, 'adjective'),
                new Question('eat', 'kin', 'Beginner', 2, 'adjective'),
            ];

            for (let question of questions) {
                this.questions.insert(question);
            }
            this.saveAll();
        }*/
    }

    private static loadData(http: Http) {
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

    static importAll(importCallback: () => void = null) {
        var self = this;
        localForage.getItem(Database.dbKey).then(function (value) {
            console.log('the full database has been retrieved');
            if (value) {
                self.db.loadJSON(value);
                self.questions = self.db.getCollection('questions');
            }

            if (importCallback)
                importCallback();
        }).catch(function (err) {
            console.log('error importing database: ' + err);
        });
    }

    static deleteAll() {
        localForage.setItem(Database.dbKey, null).then(function (value) {
            console.log('database successfully deleted');
        }).catch(function (err) {
            console.log('error while deleting: ' + err);
        });
    }

    static isLevelUnlocked(difficulty: string, level: number) {
        var levels = this.levels.data.filter(e => e.difficulty == difficulty && e.number == level);
        return true;
        // return levels.length ? levels[0].unlocked : false;
    }
}