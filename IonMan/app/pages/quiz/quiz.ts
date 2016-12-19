import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { Question } from '../../models/question';
import { Database } from '../../models/database';

declare var require: any;
var _ = require('underscore');
var Timer = require('timer.js');

declare var TTS: any;

@Component({
    templateUrl: 'build/pages/quiz/quiz.html'
})
export class QuizPage {
    isNative: boolean = true;
    difficulty: string;
    level: number;
    questions: Question[];
    answers: string[];

    timePerQuestion: number;
    timeLeft: number;
    timer: any;

    currentQuestion: Question;
    currentQuestionIndex: number;

    constructor(private nav: NavController, private params: NavParams, private platform: Platform) {
        this.isNative = !platform.is('core');
        this.currentQuestion = Question.emptyQuestion();
        this.difficulty = params.get('difficulty');
        this.level = params.get('level');
        this.timePerQuestion = params.get('time');

        this.initQuestions(params.get('allWords'));
    }

    /* allWords: "true" if user wants to be quizzed on all words
                 "false" if just on non-remembered words */
    private initQuestions(allWords: boolean) {
        var questions = Database.questions.data
            .filter(qns =>
                (qns.difficulty == this.difficulty && qns.level == this.level) &&
                (allWords || qns.correctCount < 2)
            );
        this.questions = _.shuffle(questions);
        if (questions.length == 0) {
            alert('No questions found!');
            return;
        }

        this.answers = this.questions.map(qns => qns.answer);
        this.currentQuestionIndex = 0;
        this.showQuestion();
    }

    showQuestion() {
        if (this.questions.length <= this.currentQuestionIndex) {
            this.endQuiz();
        }
        else {
            // assigns question to page scope
            var question;
            question = this.currentQuestion = this.questions[this.currentQuestionIndex];

            // filters answers to only those that are of the same type
            var answers = this.questions
                .filter(qns => qns.type == question.type && qns.answer != question.answer)
                .map(qns => qns.answer);
            answers = _.sample(answers, 3);     // takes a sample of n = 3 (4th answer will be valid)
            answers.push(question.answer);      // appends valid answer
            this.answers = _.shuffle(answers);  // shuffle & display to user

            // provides initial pronunciation, and starts timer
            this.pronounce();
            this.startTimer();
        }
    }

    pronounce() {
        // TTS is only available on native device
        // hence, will try-catch, and will not retry subsequently if failed
        if (this.isNative) {
            try {
                TTS.speak({
                    text: this.currentQuestion.question,
                    locale: 'en-GB',
                    rate: 0.75
                }, null, null);
            } catch (e) {
                this.isNative = false;
            }
        }
    }

    startTimer() {
        var self = this;
        self.timeLeft = this.timePerQuestion;

        var timer = self.timer;
        if (timer == null) {
            timer = self.timer = new Timer({
                tick: 1,
                ontick: function (milliseconds) {
                    self.timeLeft = Math.round(milliseconds / 1000);
                }
            });
        }
        timer.on('end', function () {
            self.submit('Time up.');
        });
        
        timer.start(this.timePerQuestion);
    }

    // todo: animation
    submit(answer: string) {
        this.timer.stop();
        var correctCount = this.currentQuestion.correctCount || 0;

        // correct answer
        if (answer == this.currentQuestion.answer) {
            correctCount++;
            alert('yay, you got it right!');
        }
        // wrong answer
        else {
            correctCount = 0;
            alert('no u fucking noob');
        }

        this.currentQuestion.correctCount = correctCount;
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    toggleFavorite() {
        this.currentQuestion.isFavorite = !this.currentQuestion.isFavorite;
    }

    endQuiz() {
        Database.saveAll();
        this.nav.pop();
    }

    ionViewWillLeave() {
        // disposes of timer
        this.timer = null;
    }
}

class Item {
    question: string;
    answers: string[];
    correctAnswer: number;
}