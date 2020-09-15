import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { Post } from './post.model';
import { Comments } from './comments.model';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    public postsChanged = new BehaviorSubject<Post[]>(null);
    public commentsChanged = new BehaviorSubject<Comments[]>(null);

    // public trendingPostsChanged = new BehaviorSubject<Post[]>(null);
    public trendingCommentsChanged = new BehaviorSubject<Comments[]>(null);

    // public popularPostsChanged = new BehaviorSubject<Post[]>(null);
    public popularCommentsChanged = new BehaviorSubject<Comments[]>(null);

    private posts: Post[] = [];
    private trendingPosts: Post[] = [];
    private popularPosts: Post[] = [];
    private comments: Comments[] = [];



    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}


    // create new Post

    public newPost(title: string, imageTitle: string, imageFile: File, token: string): Observable<object> {
        const data = new FormData();
        data.append('title', title);
        data.append('image', imageFile, imageTitle);
        return this.http.post(
            environment.api_key + '/posts/newPost',
            data,
            {
                headers: new HttpHeaders({
                    authorization: token
                })
            }
        ).pipe(
            tap((result) => {
                this.posts = (result as any).message;
                this.postsChanged.next(this.posts);
            }),
            catchError(this.handleError)
        );
    }


    // get All Fresh posts

    public getAllFreshPosts() {
        return this.http.get(environment.api_key + '/posts/getAllFreshPosts')
            .pipe(
                tap((posts: Post) => {
                    // console.log('posts tap', posts);
                    this.posts = (posts as any).message;
                    this.postsChanged.next(this.posts.slice());
                }),
                catchError(this.handleError)
            );
    }

    public getAllFreshPostsSlice() {
        return this.posts.slice();
    }

    public getAllTrendingPostsSlice() {
        return this.trendingPosts.slice();
    }

    public getAllPopularPostsSlice() {
        return this.popularPosts.slice();
    }

    // get All Trending posts

    public getAllTrendingPosts() {
        return this.http.get(environment.api_key + '/posts/getAllTrendingPosts')
            .pipe(
                tap((posts: Post) => {
                    console.log(this.router.url);
                    this.posts = (posts as any).message;
                    this.postsChanged.next(this.posts.slice());
                }),
                catchError(this.handleError)
            );
    }


    public getAllPopularPosts() {
        return this.http.get(environment.api_key + '/posts/getAllPopularPosts')
            .pipe(
                tap((posts: Post) => {
                    // console.log('posts tap', posts);
                    this.posts = (posts as any).message;
                    this.postsChanged.next(this.posts.slice());
                }),
                catchError(this.handleError)
            );
    }


    // upvote

    public upvote(postId: string, token: string, index: number) {
        return this.http.patch(environment.api_key + '/posts/upvote',
        {
            postId
        },
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }
        )
        .pipe(
            tap((posts: Post[]) => {
                this.posts[index] = (posts as any).message;
                this.postsChanged.next(this.posts.slice());
            }),
            catchError(this.handleError)
        );
    }


    public getAllCommentsForThisPost(postId: string, token: string) {
        return this.http.get(environment.api_key + '/comments/getAllComments/' + postId,
        {
            headers: new HttpHeaders({
                authorization: token
            }),
        }).pipe(
                tap((comments) => {
                    console.log('comments', comments);
                }),
                catchError(this.handleError)
        );
    }

    public addNewCommentForThisPost(postId: string, comment: string, token: string) {
        return this.http.post(environment.api_key + '/comments/addComment',
        {
            postId,
            comment
        },
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }).pipe(
            tap((editedComments: Comments[]) => {
                console.log('editedComments', editedComments);
                this.comments = (editedComments as any).message;
                console.log('private comments', this.comments);
                console.log(this.router.url);
                switch (this.router.url) {
                    case '/fresh':
                        this.commentsChanged.next((this.comments as any).comments.slice());
                        break;
                    case '/trending':
                        this.trendingCommentsChanged.next((this.comments as any).comments.slice());
                        break;
                    case '/popular':
                        this.popularCommentsChanged.next((this.comments as any).comments.slice());
                }
                this.commentsChanged.next((this.comments as any).comments.slice());
            }),
            catchError(this.handleError)
        );
    }


    public ifPostExists(postId: string, token: string) {
        return this.http.get(environment.api_key + '/posts/checkIfPostExists/' + postId,
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(errorResponse: HttpErrorResponse) {
        console.log('error', errorResponse);
        const errorMessage = errorResponse.error;

        return throwError(errorMessage);
    }
}
