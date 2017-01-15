import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Database } from '../../models/database';
import { Question } from '../../models/question';
import { LevelModel } from '../../models/level-model';

declare var require: any;
var _ = require('underscore');

@Component({
    templateUrl: 'build/pages/level-menu/level-menu.html'
})
export class LevelMenuPage {
    difficulty: string;
    private levels: any[];
    isLevelSelected: boolean = false;
    selectedLevel: LevelModel;

    timeChoices: any[];
    wordNumberChoices: any[];
    selectedTimeChoice: any;
    allWords: boolean;
    selectedNumberOfWords: any;

    constructor(private nav: NavController, private params: NavParams) {
        // retrieves all questions of selected difficulty
        this.difficulty = params.get('difficulty');
        var questions = Database.questions.data
            .filter(qns => qns.difficulty == this.difficulty);

        this.levels = Database.levels.data.map(e => {
            var level = e.number;
            return new LevelModel(this.difficulty,
                level,
                questions.filter(qns => qns.level == level),
                e.unlocked);
        });

        this.timeChoices = [{ time: -1 }, { time: 15 }, { time: 10 }, { time: 5 }];
        this.wordNumberChoices = [{ number: 50 }, { number: 20 }, { number: 10 }];
    }

    selectLevel(selection: number) {
        // check if level has been unlocked before proceeding
        var userSelection = _.find(this.levels, level => level.number == selection);
        if (!userSelection.unlocked)
            return;

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
        this.selectedLevel = userSelection;
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

    selectWords(allWords: boolean) {
        this.allWords = this.allWords == allWords ? null : allWords;
    }

    selectNumberOfWords(selection: number) {
        // deselects any (already) selected number of words
        var selectedNumberOfWords = this.selectedNumberOfWords;
        if (selectedNumberOfWords) {
            selectedNumberOfWords.selected = false;
            this.selectedNumberOfWords = null;

            if (selectedNumberOfWords.time == selection)
                return;
        }

        // selects number of words
        this.selectedNumberOfWords = this.wordNumberChoices.filter(x => x.number == selection)[0];
        this.selectedNumberOfWords.selected = true;
    }

    goToQuiz() {
        if (this.difficulty && this.selectedLevel && this.selectedTimeChoice && this.allWords != null && this.selectedNumberOfWords)
            this.nav.push(QuizPage, {
                difficulty: this.difficulty,
                level: this.selectedLevel.number,
                time: this.selectedTimeChoice.time,
                allWords: this.allWords,
                numberOfWords: this.selectedNumberOfWords.number
            });
    }
}