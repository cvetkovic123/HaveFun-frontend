import { Image } from './image.model';
import { WhoUpvoted } from './whoUpvoted.model';

export class Post {
    public _id: string;
    public comments: [];
    public createdAt: string;
    public whoUpvoted: WhoUpvoted;
    public picture: Image;
    public points: number;
    public title: string;
    public userId: string;

    constructor(
        _id: string,
        comments: [],
        createdAt: string,
        whoUpvoted: WhoUpvoted,
        picture: Image,
        points: number,
        title: string,
        userId: string
    ) {
        this._id = _id;
        this.comments = comments;
        this.whoUpvoted = whoUpvoted;
        this.createdAt = createdAt;
        this.picture = picture;
        this.points = points;
        this.title = title;
        this.userId = userId;
    }
}
