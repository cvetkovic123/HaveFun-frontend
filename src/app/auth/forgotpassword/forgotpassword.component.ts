import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import * as jwt_decode from "jwt-decode";
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
    constructor(
            private activatedRoute: ActivatedRoute,
            private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.logout();

        this.activatedRoute.queryParams.subscribe(params => {
          const decodedToken = jwt_decode(params.id);
          const currentDate = new Date().getTime();
          console.log(decodedToken);
          if (currentDate > decodedToken.exp) {
            this.errorSuccess('This token has expired!', '');
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
        }, (error) => {
          this.errorSuccess(error, '');
        })
    }
    
    public onTryAgain() {
      this.error = '';
    }

    public errorSuccess(error: string, success: string) {
        this.error = error;
        this.success = success;
      }

}
