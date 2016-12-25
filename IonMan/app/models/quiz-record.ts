/*  unlike Question class, QuizRecord is not meant to be persisted
    it is to be used only in the scorecard (quiz-result) Page  */
export class QuizRecord {
    id: number;
    isCorrect: boolean;

    constructor(
        public question: string,
        public answer: string,
        public yourAnswer: string,
        id?: number) {
        this.isCorrect = answer == yourAnswer;
        if (id)
            this.id = id;
    }
}