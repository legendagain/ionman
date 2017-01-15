import { Component } from '@angular/core';
import { Alert, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
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
    correctPercentage: number = 0;
    unlockedNext: boolean = false;

    constructor(private nav: NavController, private params: NavParams, private viewCtrl: ViewController, private platform: Platform) {
        this.quizTitle = params.get('title');
        this.quizRecords = params.get('quizRecords');
        this.correctCount = this.quizRecords.filter(rec => rec.isCorrect).length;
        this.correctPercentage = Math.round(this.correctCount / this.quizRecords.length * 100);
        this.unlockedNext = params.get('unlockedNext');
    }

    ionViewDidEnter() {
        if (this.unlockedNext) {
            let alert = Alert.create({
                title: 'Congratulations',
                subTitle: 'You have unlocked the next level!',
                buttons: ['OK']
            });
            this.nav.present(alert);
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}