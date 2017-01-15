import { Component } from '@angular/core';
import { Alert, Modal, NavController, NavParams, Platform } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { Question } from '../../models/question';
import { Database } from '../../models/database';
import { QuizRecord } from '../../models/quiz-record';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';

declare var require: any;
var _ = require('underscore');
var Timer = require('timer.js');

declare var cordova: any;
declare var TTS: any;

@Component({
    templateUrl: 'build/pages/quiz/quiz.html',
    directives: [ProgressBarComponent]
})
export class QuizPage {
    isNative: boolean = true;
    difficulty: string;
    level: number;
    allWords: boolean;
    numberOfWords: number;
    questions: Question[];
    answers: any[] = [];

    timePerQuestion: number;
    timeLeft: number;
    timer: any;
    correct: boolean = false;
    nextQnsTimer: any;

    currentQuestion: Question;
    currentQuestionIndex: number;

    correctAudio: MediaPlugin;
    wrongAudio: MediaPlugin

    quizRecords: QuizRecord[] = [];

    constructor(private nav: NavController, private params: NavParams, private platform: Platform) {
        try {
            this.correctAudio = new MediaPlugin(this.getAudioFilename('correct-answer.mp3'));
            this.wrongAudio = new MediaPlugin(this.getAudioFilename('wrong-answer.mp3'));
        } catch (Exception) {
            this.isNative = false;
        }

        platform.pause.subscribe(() => this.toggleTimers(true, this.timer, this.nextQnsTimer));
        platform.resume.subscribe(() => this.toggleTimers(false, this.timer, this.nextQnsTimer));

        this.currentQuestion = Question.emptyQuestion();
        this.difficulty = params.get('difficulty');
        this.level = params.get('level');
        this.timePerQuestion = params.get('time');
        this.allWords = params.get('allWords');
        this.numberOfWords = params.get('numberOfWords');
        this.initQuestions();
    }

    /* allWords: "true" if user wants to be quizzed on all words
                 "false" if just on non-remembered words */
    private initQuestions() {
        var questions = this.getQuestionsFromDatabase();
        this.questions = _.chain(questions)
            .map(qns => _.clone(qns))
            .value();
        if (questions.length == 0) {
            let alert = Alert.create({
                title: '',
                subTitle: 'No questions found!',
                buttons: ['OK']
            });
            this.nav.present(alert);
            return;
        }

        this.currentQuestionIndex = 0;
        this.showQuestion();
    }

    private getQuestionsFromDatabase(questionIds?: number[]): Question[] {
        if (questionIds != null)
            return Database.questions.data.filter(qns => _.contains(questionIds, qns.id));

        var questions = Database.questions.data
            .filter(qns => (qns.difficulty == this.difficulty && qns.level == this.level));
        if (this.allWords) {
            questions = _.sample(questions, this.numberOfWords);
        }
        else {
            var qnsArray = _.partition(questions, qns => (qns.correctCount || 0) < 2);
            // qnsArray[0]: non-remembered words; qnsArray[1]: remembered words
            var wordDifference = this.numberOfWords - qnsArray[0].length;
            if (wordDifference > 0)
                questions = _.chain(qnsArray[1])
                    .sample(wordDifference)
                    .union(qnsArray[0])
                    .shuffle()
                    .value();
            else
                questions = _.sample(qnsArray[0], this.numberOfWords);
        }
        return questions;
    }

    showQuestion() {
        if (this.questions.length <= this.currentQuestionIndex) {
            this.endQuiz();
        }
        else {
            // assigns question to page scope
            var question;
            question = this.currentQuestion = this.questions[this.currentQuestionIndex];
            this.currentQuestionIndex++;

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
        if (self.timePerQuestion > 0) {
            self.timeLeft = self.timePerQuestion;

            var timer = self.timer;
            if (timer == null) {
                timer = self.timer = new Timer({
                    tick: 0.1,
                    ontick: function (milliseconds) {
                        self.timeLeft = milliseconds / 1000;
                    }
                });
            }
            timer.on('end', function () {
                self.submit('Time up');
            });

            timer.start(this.timePerQuestion);
        }
    }

    private toggleTimers(pause: boolean, ...timers: any[]) {
        for (let timer of timers) {
            if (timer) {
                if (pause && timer.getStatus() == 'started')
                    timer.pause();
                else if (timer.getStatus() == 'paused')
                    timer.start();
            }
        }
    }

    submitActive: boolean = true;
    submit(answer: string) {
        if (!this.submitActive)
            return;
        this.submitActive = false;

        var currQuestion = this.currentQuestion;

        if (this.timer) {
            this.timer.stop();
            this.timeLeft = 0;
        }
        var correctCount = currQuestion.correctCount || 0;

        // correct answer
        this.correct = answer == this.currentQuestion.answer;
        if (this.correct) {
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

        var correctAnswer = this.answers.filter(ans => ans.text == currQuestion.answer)[0];
        correctAnswer.isCorrect = true;
        currQuestion.correctCount = correctCount;

        // Quiz records will be used to display a "scorecard" to the user
        this.quizRecords.push(new QuizRecord(currQuestion.question, currQuestion.answer, answer));

        // 2 seconds before activating next question
        var self = this;
        var nextQnsTimer = this.nextQnsTimer = new Timer({
            tick: 1
        });
        nextQnsTimer.on('end', function () {
            self.showQuestion();
        });
        nextQnsTimer.start(1.5);
    }

    private getAudioFilename(filename: string): string {
        return cordova.file.applicationDirectory + 'www/build/assets/audio/' + filename;
    }

    private playAudio(audio: MediaPlugin) {
        if (audio)
            audio.play();
    }

    private releaseAudio(audio: MediaPlugin) {
        if (audio)
            audio.release();
    }

    toggleFavorite() {
        this.currentQuestion.favorited = !this.currentQuestion.favorited;
    }

    endQuiz() {
        var questionIds = _.pluck(this.questions, 'id');
        var questions = this.getQuestionsFromDatabase(questionIds);

        // map this.questions (clones) to actual DB entities
        _.map(questions, (e: Question) => {
            var localQuestion = this.questions.find(qns => qns.question == e.question);
            if (localQuestion) {
                // update 2 properties that could have been changed
                e.correctCount = localQuestion.correctCount;
                e.favorited = localQuestion.favorited;
            }
        });

        // determines if next level can be unlocked
        var unlockedNext = this.evaluateQuiz();

        // save entities
        Database.saveAll();

        // shows "scorecard" page in modal window
        let modal = Modal.create(QuizResultPage, {
            title: this.difficulty + ' ' + this.level,
            quizRecords: this.quizRecords,
            unlockedNext: unlockedNext
        });
        modal.onDismiss(() => this.nav.pop());
        this.nav.present(modal);
    }

    /* returns whether next quiz is unlocked
       if next quiz was unlocked in a previous attempt, then it will always return false */
    private evaluateQuiz(): boolean {
        var nextLevel = Database.getNextLevel(this.difficulty, this.level);
        if (nextLevel && !nextLevel.unlocked) {
            let passingRate = 0.9;  // i.e. 90%
            var qtyCorrect = this.questions.filter(qns => qns.correctCount >= 2).length;
            var score = qtyCorrect / this.questions.length;
            if (score >= passingRate) {
                nextLevel.unlocked = true;
                return true;
            }
        }

        return false;
    }

    ionViewWillLeave() {
        // dispose of timers
        this.timer = this.nextQnsTimer = null;
        // release MediaPlugin resources
        this.releaseAudio(this.correctAudio);
        this.releaseAudio(this.wrongAudio);
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