import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

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
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
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

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.profileImageSub.unsubscribe();
  }
}
