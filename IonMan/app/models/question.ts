export class Question {
    id: number;
    question: string;   // question word in English
    answer: string;     // answer in Lao
    wrongCount: number = 0;

    constructor(question: string, answer: string, id?: number, wrongCount?: number) {
        this.question = question;
        this.answer = answer;
        if (id)
            this.id = id;
        if (wrongCount)
            this.wrongCount = wrongCount;
    }
}