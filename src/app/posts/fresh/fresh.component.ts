import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { Comments } from '../comments.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fresh',
  templateUrl: './fresh.component.html',
  styleUrls: ['./fresh.component.scss']
})
export class FreshComponent implements OnInit, OnDestroy {
  public token: string;
  public isUpvoted = false;
  public isSignedIn = false;
  public userId: string;
  public postsLiked: any;
  public freshPosts: any;
  private userSubscription: Subscription;
  public commentsLoaded = false;

  constructor(
    private postService: PostsService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    // check if user is logged in
    this.userSubscription = this.authService.user.subscribe(result => {
      // console.log('user credentials result', result);
      if (!result) {
        return;
      }
      this.token = result._token;
      this.userId = result.sub;

      this.isSignedIn = true;


      this.postService.postsChanged
        .subscribe((resultPostChanged: Post[]) => {
          if (!resultPostChanged) {
            return;
          }
          console.log('post', resultPostChanged);
          this.postsLiked = this.makeSimplerIfLikedOrNotObject(resultPostChanged);
          if (this.postsLiked) {
            console.log(this.postsLiked);
          }
          this.freshPosts = resultPostChanged;
        });


      console.log('posts slice current', this.postService.getAllFreshPostsSlice());
      if (this.postService.getAllFreshPostsSlice().length === 0) {
        this.postService.getAllFreshPosts()
        .subscribe(() => {
        }, error => {
          console.log('error', error);
        });
      } else {
        // display no posts yet in fresh
      }
    });



  }


  public onUpvote(index: number): void {
    if (!this.isSignedIn) {
      return;
    }
    const postId = this.freshPosts[index]._id;
    this.postService.upvote(postId, this.token, index)
      .subscribe((result: Post[]) => {
        // console.log('result on upvote', result);
      }, error => {
        console.log('error', error);
      });
  }

  public makeSimplerIfLikedOrNotObject(posts: Post[]): any[] {
    // console.log('making it simpler', posts);
    const newData = [];
    for ( const post in posts) {
      // console.log('posts[post].whoUpvoted', posts[post].whoUpvoted);
      if (posts[post].whoUpvoted) {
        // tslint:disable-next-line: forin
        // console.log('new post');
        // tslint:disable-next-line: forin
        for (const upvotee in posts[post].whoUpvoted) {
          // console.log(posts[post].whoUpvoted[upvotee].userId === this.userId);
          // console.log('if the user has liked this post', posts[post].whoUpvoted[upvotee].userId === this.userId);
          if (posts[post].whoUpvoted[upvotee].userId === this.userId) {
              if (posts[post].whoUpvoted[upvotee].isUpvoted) {
                newData.push({ isUpvoted: posts[post].whoUpvoted[upvotee].isUpvoted});
              } else {
                newData.push({ isUpvoted: false});
              }
              // if the user has never upvoted ie does not exist in
          }
        }
      }
    }
    return newData;
  }



  public toFreshComments(post) {
    const postId = post ? post._id : null;
    this.commentsLoaded = true;
    this.router.navigate([ '/fresh', { id: postId } ]);
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
