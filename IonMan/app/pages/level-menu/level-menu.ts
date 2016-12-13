import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Difficulty } from '../../models/level'
import { QuizPage } from '../quiz/quiz';

@Component({
    templateUrl: 'build/pages/level-menu/level-menu.html'
})
export class LevelMenuPage {
    private difficulty: Difficulty;
    constructor(private nav: NavController, private params: NavParams) {
        this.difficulty = params.get('difficulty');
    }

    onLink(url: string) {
        window.open(url);
    }

    formatDifficulty(difficulty: Difficulty) {
        return Difficulty[difficulty];
    }

    goToQuestions(level: number) {
        this.nav.push(QuizPage, { difficulty: this.difficulty, level: level });
    }
}
