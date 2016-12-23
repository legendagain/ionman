import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { Question } from '../../models/question';
import { Database } from '../../models/database';

declare var require: any;
var _ = require('underscore');
var Timer = require('timer.js');

declare var cordova: any;
declare var TTS: any;

@Component({
    templateUrl: 'build/pages/quiz/quiz.html'
})
export class QuizPage {
    isNative: boolean = true;
    difficulty: string;
    level: number;
    questions: Question[];
    answers: any[] = [];

    timePerQuestion: number;
    timeLeft: number;
    timer: any;
    nextQnsTimer: any;

    currentQuestion: Question;
    currentQuestionIndex: number;

    correctAudio: MediaPlugin;
    wrongAudio: MediaPlugin

    constructor(private nav: NavController, private params: NavParams, private platform: Platform) {
        try {
            this.correctAudio = new MediaPlugin(this.getAudioFilename('correct-answer.mp3'));
            this.wrongAudio = new MediaPlugin(this.getAudioFilename('wrong-answer.mp3'));
        } catch (Exception) { }

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
            answers = _.shuffle(answers);       // shuffle, and display to user
            this.answers = answers.map(ans => {
                return { text: ans };
            });

            // provides initial pronunciation, and starts timer
            this.pronounce();
            this.startTimer();
            this.submitActive = true;
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
                },
                    function () { },    // success callback
                    function () { });   // failure callback
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

    submitActive: boolean = true;
    submit(answer: string) {
        if (!this.submitActive)
            return;
        this.submitActive = false;

        this.timer.stop();
        this.timeLeft = 0;
        var correctCount = this.currentQuestion.correctCount || 0;

        // correct answer
        if (answer == this.currentQuestion.answer) {
            this.playAudio(this.correctAudio);
            correctCount++;
        }
        // wrong answer
        else {
            this.playAudio(this.wrongAudio);
            correctCount = 0;
            var wrongAnswer = this.answers.filter(ans => ans.text == answer)[0];
            if (wrongAnswer)
                wrongAnswer.isCorrect = false;  // i.e. is wrong
        }

        var correctAnswer = this.answers.filter(ans => ans.text == this.currentQuestion.answer)[0];
        correctAnswer.isCorrect = true;

        this.currentQuestion.correctCount = correctCount;
        this.currentQuestionIndex++;

        var self = this;
        var nextQnsTimer = this.nextQnsTimer = new Timer({
            tick: 1
        });
        nextQnsTimer.on('end', function () {
            self.showQuestion();
        });
        nextQnsTimer.start(2.5);
    }

    private getAudioFilename(filename: string): string {
        return cordova.file.applicationDirectory + 'www/build/assets/audio/' + filename;
    }

    private playAudio(audio: MediaPlugin) {
        if (audio)
            audio.play();
    }

    toggleFavorite() {
        this.currentQuestion.favorited = !this.currentQuestion.favorited;
    }

    endQuiz() {
        Database.saveAll();
        this.nav.pop();
    }

    ionViewWillLeave() {
        // disposes of timers
        this.timer = this.nextQnsTimer = null;
    }
}

class Item {
    question: string;
    answers: string[];
    correctAnswer: number;
}

class Answer {
    text: string;
    isCorrect: boolean;
}