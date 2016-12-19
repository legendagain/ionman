import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Database } from '../../models/database';
import { Question } from '../../models/question';

declare var require: any;
var _ = require('underscore');

@Component({
    templateUrl: 'build/pages/level-menu/level-menu.html'
})
export class LevelMenuPage {
    difficulty: string;
    private levels: any[];
    isLevelSelected: boolean = false;
    selectedLevel: Level;

    timeChoices: any[];
    selectedTimeChoice: any;

    constructor(private nav: NavController, private params: NavParams) {
        // retrieves all questions of selected difficulty
        this.difficulty = params.get('difficulty');
        var questions = Database.questions.data
            .filter(qns => qns.difficulty == this.difficulty);

        var levels = questions.map(qns => qns.level);
        this.levels = _.uniq(levels).map(level =>
            new Level(this.difficulty, level, questions.filter(qns => qns.level == level))
        );

        this.timeChoices = [{ time: 15 }, { time: 10 }, { time: 5 }];
    }

    selectLevel(selection: number) {
        // user taps on already selected level, de-selecting it
        var selectedLevel = this.selectedLevel;
        if (selectedLevel && selectedLevel.number == selection) {
            this.isLevelSelected = selectedLevel.selected = false;
            this.selectedLevel = null;
            return;
        }

        // otherwise, selects level
        var levels = this.levels;
        for (let level of levels) {
            level.selected = false;
        }
        this.selectedLevel = levels.filter(level => level.number == selection)[0];
        this.isLevelSelected = this.selectedLevel.selected = true;
    }

    selectTime(selection: number) {
        // deselects any (already) selected time
        var selectedTimeChoice = this.selectedTimeChoice;
        if (selectedTimeChoice) {
            selectedTimeChoice.selected = false;
            this.selectedTimeChoice = null;

            if (selectedTimeChoice.time == selection)
                return;
        }

        // selects time
        this.selectedTimeChoice = this.timeChoices.filter(x => x.time == selection)[0];
        this.selectedTimeChoice.selected = true;
    }

    goToQuiz(allWords: boolean) {
        if (!this.difficulty || !this.selectedLevel || !this.selectedTimeChoice)
            return;

        this.nav.push(QuizPage, {
            difficulty: this.difficulty,
            level: this.selectedLevel.number,
            time: this.selectedTimeChoice.time,
            allWords: allWords
        });
    }
}

class Level {
    unlocked: boolean = true;
    correctQuestions: number = 0;
    totalQuestions: number = 0;
    selected: boolean = false;

    constructor(
        difficulty: string,
        public number: number,
        questions: Question[]
    ) {
        this.unlocked = Database.isLevelUnlocked(difficulty, number);
        this.correctQuestions = questions.filter(qns => qns.correctCount >= 2).length;
        this.totalQuestions = questions.length;
    }
}