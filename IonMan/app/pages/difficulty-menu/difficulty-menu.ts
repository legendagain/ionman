import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Difficulty } from '../../models/level'
import { LevelMenuPage } from '../level-menu/level-menu';

@Component({
    templateUrl: 'build/pages/level-menu/level-menu.html'
})
export class DifficultyMenuPage {
    difficulties: Difficulty[];
    constructor(private nav: NavController) {
        this.difficulties = [Difficulty.Beginner, Difficulty.Intermediate];
    }

    onLink(url: string) {
        window.open(url);
    }

    formatDifficulty(difficulty: Difficulty) {
        return Difficulty[difficulty];
    }

    goToDifficulty(difficulty: Difficulty) {
        this.nav.push(LevelMenuPage, { difficulty: difficulty });
    }
}
