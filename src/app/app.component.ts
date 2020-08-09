import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _token: string;
  public userSub: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.userSub = this.authService.user.subscribe((res) => {
      if (!res) {
        return;
      }
      this._token = res._token;
    });
    if (this._token) {
      console.log('run');
      this.authService.getProfileImage(this._token);
    } else {
      this.authService.profileImage.next(('../assets/paperKit2/assets/img/no-avatar.jpg' as any));
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
