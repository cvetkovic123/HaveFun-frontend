import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    private errorEmailCatcher = {};
    constructor(private http: HttpClient, private router: Router) {}

    public signUp(name: string, email: string, password: string) {
        return this.http.post('http://localhost:3300/users/signUp',
        {
            name,
            email,
            password,
        }).pipe(
            catchError(this.handleError),
            tap((resData) => {
                console.log(`signUp response data:${resData}`);
            })
        );
    }

    public signIn(email: string, password: string) {
        return this.http.post('http://localhost:3300/users/signIn',
        {
            email,
            password,
        }).pipe(
            catchError(this.handleError),
            tap((resData) => {
                this.handleAuthentification(resData['message']);
            })
        );
    }

    public emailVerification(token: string) {
        return this.http.get(
            'http://localhost:3300/users/emailVerification',
            {
                headers: new HttpHeaders({authentification: token})
            })
            .pipe(
                catchError(this.handleError),
                tap((resData) => {
                })
            );
    }



    private handleError(errorResponse: HttpErrorResponse) {
        console.log('errorResponse', errorResponse);
        let errorMessage = 'An unknown error occured';

        if (errorResponse.error.startsWith('<!DOCTYPE')) {
            const paragraph = errorResponse.error;
            const regex = /<pre>(.*?)<\/pre>/;
            this.errorEmailCatcher = paragraph.match(regex);
        }

        switch (errorResponse.error.message || errorResponse.error) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
            case 'Unauthorized':
                errorMessage = 'This email was not registered or the   password is incorrect!';
                break;
        }
        if (this.errorEmailCatcher) {
            errorMessage = this.errorEmailCatcher[1];
        }
        return throwError(errorMessage);
    }

    private handleAuthentification(token: string) {
        const decodedToken = jwt_decode(token);
        const expirationDate = new Date(decodedToken.exp);
        const user = new User(
            decodedToken.iss,
            decodedToken.sub,
            decodedToken.email,
            token,
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(decodedToken.exp);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    public autoLogout(expirationDuration: number) {
        console.log('expirationDuration', expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration - Date.now());
    }

    public logout(): void {
        this.user.next(null);
        this.router.navigate(['auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    public autoLogin(): void {
        const userData: {
            iss: string,
            sub: string,
            email: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.iss,
            userData.sub,
            userData.email,
            userData._token,
            new Date(userData._tokenExpirationDate));

        if (loadedUser._token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

}
