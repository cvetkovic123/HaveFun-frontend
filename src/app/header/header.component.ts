import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public userSub: Subscription;
  public profileImageSub: Subscription;
  public profileImage = '../../assets/paperKit2/assets/img/no-avatar.jpg';
  constructor(
      private authService: AuthService,
      private router: Router,
      private postService: PostsService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      // console.log(user._token);
      console.log(!!user);
      this.isAuthenticated = !!user;
    });
    this.profileImageSub = this.authService.profileImage.subscribe(image => {
      this.profileImage = (image as any);
    });
  }

  public onLogout(): void {
    this.authService.logout();
    this.profileImage = '../../assets/paperKit2/assets/img/no-avatar.jpg';
  }

  public onNewPost(): void {
    this.router.navigate(['/new']);
  }

  public getAllFreshPosts(): void {
    this.postService.getAllFreshPosts().subscribe();
  }

  public getAllTrendingPosts(): void {
    this.postService.getAllTrendingPosts().subscribe();
  }



  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.profileImageSub.unsubscribe();
  }
}
