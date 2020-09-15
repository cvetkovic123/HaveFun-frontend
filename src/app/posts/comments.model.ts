import { Comment } from './comment.model';

export class Comments {
    constructor(
        public postsId: string,
        comments: Comment,
        postCommentDate
    ) {}
}
