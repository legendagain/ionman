import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { QuizRecord } from '../../models/quiz-record';

declare var require: any;
var _ = require('underscore');

@Component({
    templateUrl: 'build/pages/quiz-result/quiz-result.html'
})
export class QuizResultPage {
    quizTitle: string;
    quizRecords: QuizRecord[];
    correctCount: number = 0;

    constructor(private nav: NavController, private params: NavParams, private platform: Platform) {
        this.quizTitle = params.get('title');
        this.quizRecords = params.get('quizRecords');
        this.correctCount = this.quizRecords.filter(rec => rec.isCorrect).length;
    }
}