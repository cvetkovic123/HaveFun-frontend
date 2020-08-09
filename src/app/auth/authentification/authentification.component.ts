import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DOCUMENT } from '@angular/common';


export interface User {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }

@Component({
    selector: 'app-authentification',
    templateUrl: './authentification.component.html',
    styleUrls: ['./authentification.component.scss']
})


export class AuthentificationComponent implements OnInit, OnDestroy {
    public error: string;
    public success: string;
    public errorResend: string;
    public successResend: string;
    public isLoginMode = false;

    public user: User = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    constructor(
      private router: Router,
      private authService: AuthService,
      @Inject(DOCUMENT) private document: Document) {
      }

    ngOnInit(): void {
      this.authService.user.subscribe(user => {
        const isAuth = !!user;
        if (isAuth) {
          this.router.navigate(['/auth/profile']);
        }
      });
    }

    public onSubmit(form: NgForm): void {
      if (!form.valid) {
        return;
      }

      const name = form.value.name;
      const email = form.value.email;
      const password = form.value.password;

      if (!this.isLoginMode) {
        this.authService.signUp(name, email, password)
          .subscribe((responseData) => {
            this.errorSuccess('', responseData['message']);
          }, (error) => {
            this.errorSuccess(error, '');
          });
      } else {
        console.log('runs!!?');
        this.authService.signIn(email, password)
          .subscribe((result) => {
            this.authService.getProfileImage((result as any).message);
            this.errorSuccess('', '');
            this.router.navigate(['popular']);
          }, (error) => {
            this.errorSuccess(error, '');
          });
      }
    }

    public onResendEmail(form: NgForm): void {
      if (!form.valid) {
        return;
      }

      const email = form.value.email;
      const password = form.value.password;
      this.authService.resendEmail(email, password)
        .subscribe((result) => {
          console.log(result);
          this.errorSuccessResendEmail('', (result as any).message);
        }, (error) => {
          console.log('error', error);
          this.errorSuccessResendEmail(error, '');
        });
    }

    public onSwitchMode(form: NgForm): void {
      this.isLoginMode = !this.isLoginMode;
      this.errorSuccess('', '');
      form.reset();
    }

    public errorSuccess(error: any, success: string) {
      this.error = error;
      this.success = success;
    }

    public errorSuccessResendEmail(error: any, success: string) {
      this.errorResend = error;
      this.successResend = success;
    }

    ngOnDestroy(): void {
      // this.document.body.classList.remove('modal-open');
      // this.document.body.classList.remove('modal-backdrop');
    }
}
