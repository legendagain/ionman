import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Question } from '../../models/question';
import { Database } from '../../models/database';

declare var require: any;
var _ = require('underscore');

@Component({
    templateUrl: 'build/pages/favorites/favorites.html'
})
export class FavoritesPage {
    levels: any[];

    constructor(private nav: NavController) {
        var questions = Database.questions.data;
        this.levels = _.chain(questions)
            .groupBy(qns => qns.difficulty + ' ' + qns.level)
            .map((value, key) => {
                return {
                    title: key,
                    questions: value,
                };
            });
        console.log('showing favorites...');
            /*.sortBy(level => {

            });*/

        /*this.levels = _.sortBy(levels, level => {
            var key = _.keys(level)[0];
            switch (key) {
                case 'Beginner':
                    return 0;
                case 'Intermediate':
                    return 1;
                case 'Advanced':
                    return 2;
                default:
                    return 3;
            }
        });

        for (let level of levels) {

        }*/
    }
}