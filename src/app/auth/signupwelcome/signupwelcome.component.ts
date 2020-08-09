import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup-welcome',
    templateUrl: './signupwelcome.component.html',
    styleUrls: ['./signupwelcome.component.scss']
})
export class SignUpWelcomeComponent implements OnInit {
    public success: string;
    public error: string;
    public accountActivated = false;
    public token: string;
    constructor(
            private activatedRoute: ActivatedRoute,
            private authService: AuthService) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.token = params.id;
            this.authService.emailVerification(this.token)
                .subscribe(resData => {
                    this.errorSuccess('', resData['message']);
                    this.accountActivated = true;
                }, (error) => {
                    this.errorSuccess(error, '');
                });
        });
    }

    public errorSuccess(error: string, success: string) {
        this.error = error;
        this.success = success;
      }
}
