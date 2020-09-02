import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as jwt_decode from 'jwt-decode';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  public success: string;
  public error: string;
  public accountActivated = false;
  public token: string;
  public email: string;
  public timeLeft: number;
  public passwordChanged = false;

  constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {}

    ngOnInit(): void {
      // check if anybody is signed in

      if (localStorage.getItem('userData')) {
        console.log('alo');
        this.authService.logout();
      }

      this.activatedRoute.queryParams.subscribe(params => {
        const decodedToken = jwt_decode(params.id);
        console.log(decodedToken);
        const currentDate = new Date().getTime();
        this.checkIfTimedOut(currentDate, decodedToken.exp);

        if (currentDate > decodedToken.exp) {
          this.errorSuccess('This token has expired!', '');
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 5000);
          return;
        }
        this.token = params.id;
        this.email = decodedToken.sub;

        // this.authService.forgotChangePassword(email, )
      });
    }




    public forgotChangePassword(form: NgForm) {
      if (!form.valid) {
        return;
      }
      const newPassword = form.value.password;
      const confirmPassword = form.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.errorSuccess('Password\'s are not the same!', '');
        form.reset();
        return;
      }
      this.authService.forgotChangePassword(this.email, confirmPassword, this.token)
        .subscribe((responseData) => {
          this.errorSuccess('', responseData['message']);
          this.passwordChanged = true;
          console.log(this.passwordChanged);
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 5000);
        }, (error) => {
          this.errorSuccess(error, '');
        });
    }

    public onTryAgain() {
      if (this.timeLeft > 0) {
        this.error = '';
      } else {
        this.router.navigate(['/auth']);
      }
    }

    public errorSuccess(error: string, success: string) {
        this.error = error;
        this.success = success;
    }

    public checkIfTimedOut(currentDate: number, expiryDate: number): void {
      this.timeLeft = expiryDate - currentDate;

      setTimeout(() => {
        this.errorSuccess('This token has expired!', '');
      }, this.timeLeft);
    }

}
