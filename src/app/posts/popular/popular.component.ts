import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comments } from '../comments.model';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss']
})
export class PopularComponent implements OnInit, OnDestroy {
  public token: string;
  public isUpvoted = false;
  public isSignedIn = false;
  public userId: string;
  public postsLiked: any;
  public popularPosts: any;
  private userSubscription: Subscription;
  public commentsLoaded = false;

  constructor(
    private postService: PostsService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
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
          this.popularPosts = resultPostChanged;
        });


      console.log('posts slice current', this.postService.getAllPopularPostsSlice());
      if (this.postService.getAllPopularPostsSlice().length === 0) {
        this.postService.getAllPopularPosts()
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
    const postId = this.popularPosts[index]._id;
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

  public toTrendingComments(post) {
    const postId = post ? post._id : null;
    this.commentsLoaded = true;
    this.router.navigate([ '/popular', { id: postId } ]);
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
