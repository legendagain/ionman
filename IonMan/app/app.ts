import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar, SQLite } from 'ionic-native';
import { HomePage } from './pages/home/home';

import { Question } from './models/question';
import { Level } from './models/level';

declare var require: any;
var loki = require('lokijs');

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
    db: any;
    questions: any;
    rootPage: any = HomePage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            // initialize the database
            let db = new SQLite({
                name: 'data.db',
                location: 'default'
            });
            db.executeSql('create table danceMoves(name VARCHAR(32))', {}).then(() => {
            }, (err) => {
                console.error('Unable to execute sql: ', err);
            });
            
            this.db = new loki('ionman.db');
            this.questions = this.db.addCollection('questions');
            this.questions.insert({ name: 'Bender', tvShow: 'Futurama' });
            alert('hi');

            /*createConnection({
                driver: {
                    type: "sqlite",
                    database: "data"
                },
                entities: [
                    Question,
                    Level
                ],
                autoSchemaSync: true,
            }).then(connection => {
                alert('connection created!');
            });*/
        });
    }
}

ionicBootstrap(MyApp);
