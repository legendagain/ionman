import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Database } from '../../models/database';
import { Question } from '../../models/question';
import { LevelModel } from '../../models/level-model';
import { ProgressChartComponent } from '../../components/progress-chart/progress-chart';

@Component({
    templateUrl: 'build/pages/progress/progress.html',
    directives: [ProgressChartComponent]
})
export class ProgressPage {
    levels: LevelModel[] = new Array<LevelModel>();

    constructor(private nav: NavController) {
        var allQuestions = Database.questions.data;
        for (let level of Database.levels.data) {
            var questions = allQuestions.filter(qns =>
                qns.difficulty == level.difficulty && qns.level == level.number);
            this.levels.push(new LevelModel(
                level.difficulty, level.number, questions, level.unlocked
            ));
        }
    }
}