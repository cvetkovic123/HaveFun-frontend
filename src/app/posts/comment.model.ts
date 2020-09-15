export class Comment {
    constructor(
        public whoWroteItId: string,
        public name: string,
        public image: string,
        public comment: string,
        public commentDate: string
    ) {}
}
