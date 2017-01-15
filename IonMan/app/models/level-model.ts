import { Question } from './question';

export class LevelModel {
    correctQuestions: number = 0;
    totalQuestions: number = 0;
    correctPercentage: number = 0;
    selected: boolean = false;

    constructor(
        difficulty: string,
        public number: number,
        questions: Question[],
        public unlocked: boolean = false
    ) {
        this.correctQuestions = questions.filter(qns => qns.correctCount >= 2).length;
        this.totalQuestions = questions.length;
        this.correctPercentage = Math.round(this.correctQuestions / this.totalQuestions * 100);
    }
}