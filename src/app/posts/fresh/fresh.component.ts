import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-fresh',
  templateUrl: './fresh.component.html',
  styleUrls: ['./fresh.component.scss']
})
export class FreshComponent implements OnInit, OnDestroy {
  public upvoteClass = 'btn btn-light';
  public token: string;
  public isUpvoted = false;
  public isDownvoted = false;
  public isSignedIn = false;
  public userId: string;
  public postsLiked;
  public freshPosts: any;
  public userSubscription: Subscription;
  public postSubscription: Subscription;

  constructor(
    private postService: PostsService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(result => {
      // console.log('user credentials result', result);
      if (!result) {
        return;
      }
      this.token = result._token;
      this.userId = result.sub;

      this.isSignedIn = true;

      this.postSubscription = this.postService.postsChanged
        .subscribe((resultPostChanged: Post[]) => {
          console.log('postsChanged', resultPostChanged);
          this.postsLiked = this.makeSimplerIfLikedOrNotObject(resultPostChanged);
          this.freshPosts = resultPostChanged;
        });


      if (this.postService.getAllPostsSlice().length === 0) {
        this.postService.getAllPosts()
        .subscribe(() => {
        }, error => {
          console.log('error', error);
        });
      } else {
        this.freshPosts = this.postService.getAllPostsSlice();
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
    console.log('making it simpler', posts);
    const newData = [];
    for ( const post in posts) {
      if (posts[post].whoUpvoted) {
        console.log(posts[post].whoUpvoted);
        // tslint:disable-next-line: forin
        for (const upvotee in posts[post].whoUpvoted) {
          console.log(posts[post].whoUpvoted[upvotee]);
          if (posts[post].whoUpvoted[upvotee].userId === this.userId) {
              if (posts[post].whoUpvoted[upvotee].isUpvoted) {
                newData.push({ isUpvoted: posts[post].whoUpvoted[upvotee].isUpvoted});
              } else {
                newData.push({ isUpvoted: false});
              }
          }
        }
      }
    }
    return newData;
  }


  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
