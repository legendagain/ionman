export class Level {
    id: number;

    constructor(
        public number: number,
        public difficulty: string = '',
        public unlocked: boolean = false,
        public index: number = -1
    ) { }
}