import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LevelMenuPage } from '../level-menu/level-menu';
import { Database } from '../../models/database'

declare var require: any;
var _ = require('underscore');

@Component({
    templateUrl: 'build/pages/difficulty-menu/difficulty-menu.html'
})
export class DifficultyMenuPage {
    difficulties: string[];

    constructor(private nav: NavController) {
        var difficulties = Database.questions.data.map(qns => qns.difficulty);
        this.difficulties = _.uniq(difficulties);
    }

    onLink(url: string) {
        window.open(url);
    }

    goToDifficulty(difficulty: string) {
        this.nav.push(LevelMenuPage, { difficulty: difficulty });
    }
}
