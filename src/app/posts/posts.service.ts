import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { env } from 'process';
import { Post } from './post.model';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    public postsChanged = new BehaviorSubject<Post[]>(null);
    private posts: Post[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}


    // create new Post

    public newPost(title: string, imageTitle: string, imageFile: File, token: string): Observable<object> {
        const data = new FormData();
        data.append('image', imageFile, imageTitle);
        data.append('title', title);
        return this.http.post(
            environment.api_key + '/posts/newPost',
            data,
            {
                headers: new HttpHeaders({
                    authorization: token
                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }


    // get All Posts

    public getAllPosts() {
        return this.http.get(environment.api_key + '/posts/getAllPosts')
            .pipe(
                tap((posts: Post) => {
                    // console.log('posts tap', posts);
                    this.posts = (posts as any).message;
                    this.postsChanged.next(this.posts.slice());
                }),
                catchError(this.handleError)
            );
    }

    public getAllPostsSlice() {
        return this.posts.slice();
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

                console.log('posts upvote result', posts);
                console.log('all posts', this.posts);
                this.posts[index] = (posts as any).message;
                this.postsChanged.next(this.posts.slice());
                // const postData = (posts as any).message;
                // const userId = postData.userId;

                // console.log('postData', postData);
                // console.log('userId', userId);
                // console.log('whoActuallyUpvoted', postData.whoUpvoted);
                // this.posts[index]. = whoActualyUpvoted.isUpvoted;
                // this.postsChanged.next(this.posts.slice());

                // tslint:disable-next-line: forin
                // for (const upvotee in postData.whoUpvoted) {
                //     // console.log('post which i need to edit', this.posts[index]);
                //     if (postData.whoUpvoted[upvotee].userId === userId) {
                //         console.log('this post before', this.posts);
                //         this.posts[index] = postData.whoUpvoted[upvotee];
                //         this.postsChanged.next(this.posts.slice());
                //         console.log('this posts after', this.posts);
                //     }
                // }
            }),
            catchError(this.handleError)
        );
    }

    private handleError(errorResponse: HttpErrorResponse) {
        console.log('error', errorResponse);
        const errorMessage = errorResponse.error;

        return throwError(errorMessage);
    }
}
