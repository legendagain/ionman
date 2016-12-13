import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { Difficulty } from '../../models/level';
import { Question } from '../../models/question';

@Component({
    templateUrl: 'build/pages/level-menu/level-menu.html'
})
export class QuizPage {
    difficulty: Difficulty;
    level: number;
    Questions: Question[];
    
    constructor(private nav: NavController, private params: NavParams) {
        this.difficulty = params.get('difficulty');
        this.level = params.get('level');


    }

    onLink(url: string) {
        window.open(url);
    }
}
