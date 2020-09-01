import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon';


const googleLogoURL = 
"https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

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
    public errorPasswordForgot: string;
    public successPasswordForgot: string;
    public isLoginMode = false;
    public isLoading = false;

    // for social log in

    public user: User = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    constructor(
      private router: Router,
      private authService: AuthService,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer
      ){this.matIconRegistry.addSvgIcon("logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL))}

    ngOnInit(): void {
      this.authService.user.subscribe(user => {
        const isAuth = !!user;
        if (isAuth) {
          this.router.navigate(['/auth/profile']);
        }
      });
    }

    public signInWithGoogle(): void {
      this.isLoading = true;
      this.authService.backendGoogleSignIn()
        .subscribe(response => {
          this.isLoading = false;
          console.log('backendgoogle Sign in response', response);
        }); 
    }
   


    public onSubmit(form: NgForm): void {
      if (!form.valid) {
        return;
      }
      this.isLoading = true;

      const name = form.value.name;
      const email = form.value.email;
      const password = form.value.password;

      if (!this.isLoginMode) {
        this.authService.signUp(name, email, password)
          .subscribe((responseData) => {
            this.isLoading = false;
            this.errorSuccess('', responseData['message']);
          }, (error) => {
            this.isLoading = false;
            this.errorSuccess(error, '');
          });
      } else {
        this.authService.signIn(email, password)
          .subscribe((result) => {
            console.log('result', result);
            this.isLoading = false;
            this.authService.getProfileImage((result as any).message);
            this.errorSuccess('', '');
            this.router.navigate(['popular']);
          }, (error) => {
            this.isLoading = false;
            console.log(error);
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

    public onForgotPassword(form: NgForm): void {
      if (!form.valid) {
        return;
      }

      const email = form.value.email;

      this.authService.forgotPassword(email)
        .subscribe((result) => {
          this.onErrorPasswordForgot('', (result as any).message);
        }, (error) => {
          this.onErrorPasswordForgot(error, '');
        })
    }

    public onSwitchMode(form: NgForm): void {
      this.isLoginMode = !this.isLoginMode;
      this.errorSuccess('', '');
      form.reset();
    }

    public onErrorPasswordForgot(error: any, success: string) {
      this.errorPasswordForgot = error;
      this.successPasswordForgot = success;
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
    
    }
}
