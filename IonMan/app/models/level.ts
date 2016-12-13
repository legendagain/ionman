import { Question } from '../models/question';

export class Level {
    id: number;
    difficulty: Difficulty;
    level: number;
    title: string;
    questions: Question[];

    public constructor(level: number, title: string, difficulty?: Difficulty, id?: number) {
        this.level = level;
        this.title = title;
        if (difficulty)
            this.difficulty = difficulty;
        if (id)
            this.id = id;
    }
}

export enum Difficulty {
    Beginner = 1,
    Intermediate = 2
}