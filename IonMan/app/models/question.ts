export class Question {
    id: number;
    correctCount: number = 0;
    isFavorite: boolean = false;

    constructor(
        public question: string,    // question word in English
        public answer: string,      // answer in Lao
        public difficulty: string,  // "Beginner", "Intermediate", etc.
        public level: number,       // level (stage) of difficulty (i.e. Beginner 1, Beginner 2)
        public type: string,        // "noun", "adjective", or otherwise
        id?: number) {
        if (id)
            this.id = id;
    }

    static emptyQuestion() {
        var qns = new Question('', '', '', -1, '');
        return qns;
    }
}