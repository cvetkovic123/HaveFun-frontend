import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comments } from '../comments.model';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit, OnDestroy {
  public upvoteClass = 'btn btn-light';
  public token: string;
  public isUpvoted = false;
  public isDownvoted = false;
  public isSignedIn = false;
  public userId: string;
  public postsLiked: any;
  public trendingPosts: any;
  public userSubscription: Subscription;
  public postSubscription: Subscription;
  public comments: Comments[] = [];
  public isComments = false;

  constructor(
    private postService: PostsService,
    private authService: AuthService) { }

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
          // console.log('is null', resultPostChanged);
          this.postsLiked = this.makeSimplerIfLikedOrNotObject(resultPostChanged);
          // console.log('postsLiked', this.postsLiked);
          this.trendingPosts = resultPostChanged;
        });


      console.log('posts slice current', this.postService.getAllTrendingPostsSlice());
      if (this.postService.getAllTrendingPostsSlice().length === 0) {
        console.log('true');
        this.postService.getAllTrendingPosts()
        .subscribe((trendingResult) => {
          console.log('trending result', trendingResult);
        }, error => {
          console.log('error', error);
        });
      } else {
        // this.trendingPosts = this.postService.getAllPostsSlice();
      }
    });
  }

  public onUpvote(index: number): void {
    if (!this.isSignedIn) {
      return;
    }
    const postId = this.trendingPosts[index]._id;
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

  public getComments(data) {
    this.isComments = true;
    console.log('post which i clicked', data);

    this.postService.getAllCommentsForThisPost(data._id, this.token)
      .subscribe(result => {
        console.log('result', result);
        this.comments = (result as any).message;
      }, error => {
        console.log('error', error);
      });
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
