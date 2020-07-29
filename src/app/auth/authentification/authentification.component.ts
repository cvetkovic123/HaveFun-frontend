import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


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


export class AuthentificationComponent implements OnInit {
    private error: string;
    private success: string;
    public isLoginMode = false;
    public user: User = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
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
        this.authService.signIn(email, password)
          .subscribe(() => {
            this.errorSuccess('', '');
            this.router.navigate(['popular']);
          }, (error) => {
            this.errorSuccess(error, '');
          });
      }

      // this.router.navigate(['/popular']);
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
}
