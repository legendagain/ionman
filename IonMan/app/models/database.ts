import { SQLite } from 'ionic-native';
import { Question } from './question';

declare var require: any;
var loki = require('lokijs');
var localForage = require('localforage');

export class Database {
    static dbKey: string = "ion-man";
    static db: any;
    public static questions: any;
    public static levels: any;

    static init() {
        // initialize the database
        this.db = new loki('ionman.db');
        // this.deleteAll();
        this.questions = this.db.addCollection('questions');
        this.levels = this.db.addCollection('levels');

        this.importAll();
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
        }
    }

    static saveAll() {
        localForage.setItem(Database.dbKey, JSON.stringify(this.db)).then(function (value) {
            console.log('database successfully saved');
        }).catch(function (err) {
            console.log('error while saving: ' + err);
        });
    }

    static importAll() {
        var self = this;
        localForage.getItem(Database.dbKey).then(function (value) {
            console.log('the full database has been retrieved');
            if (value) {
                self.db.loadJSON(value);
                self.questions = self.db.getCollection('questions');
            }
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