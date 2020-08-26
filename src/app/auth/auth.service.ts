import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { ProfileImage } from './profileImage.model';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user = new BehaviorSubject<User>(null);
    public profileImage = new BehaviorSubject<ProfileImage>(null);
    public noAvatar = '../../assets/paperKit2/assets/img/no-avatar.jpg';
    private tokenExpirationTimer: any;
    private errorEmailCatcher = {};
    constructor(private http: HttpClient, private router: Router) {}

    public signUp(
        name: string,
        email: string,
        password: string): Observable<object> {

        return this.http.post( environment.api_key + '/users/signUp',
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

    public signIn(email: string, password: string): Observable<object> {
        return this.http.post(environment.api_key + '/users/signIn',
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

    public emailVerification(token: string): Observable<object> {
        return this.http.get(
            environment.api_key + '/users/emailVerification',
            {
                headers: new HttpHeaders({authentification: token})
            })
            .pipe(
                catchError(this.handleError)
            );
    }


    public uploadProfileImage(file: File, title: string, token: string) {
        const uploadImageData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        uploadImageData.append('image', file, title);
        return this.http.post(
            environment.api_key + '/users/imageUpload',
                uploadImageData,
            {
                headers: new HttpHeaders({
                    authorization: token,

                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }

    public getProfileImage(token: string) {
        return this.http.get(
            environment.api_key + '/users/getProfileImage',
            {
                headers: new HttpHeaders({
                    authorization: token
                })
            }
        ).subscribe((result) => {
            if ((result as any).message === 'User has not yet uploaded image') {
                return;
            } else {
                this.profileImage.next((result as any).message);
            }
          });
    }

    public resendEmail(email: string, password: string) {
        return this.http.post(
            environment.api_key + '/users/resendEmailVerification',
            {
                email,
                password
            }
        ).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(errorResponse: HttpErrorResponse) {
        // console.log('error', errorResponse.error);
        let errorMessage = 'An unknown error occured';
        // if (errorResponse.message.startsWith('Http failure response')) {
        //     errorMessage = 'Backend not connected';
        //     return throwError(errorMessage);
        // }

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
                errorMessage = 'This email was not registered or the password is incorrect!';
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
            decodedToken.name,
            decodedToken.email,
            token,
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(decodedToken.exp);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    public autoLogout(expirationDuration: number) {

        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    public logout(): void {
        this.user.next(null);
        this.profileImage.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    public autoLogin(): void {
        console.log('AutoLogin started');
        const userData: {
            iss: string,
            sub: string,
            name: string
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
            userData.name,
            userData.email,
            userData._token,
            new Date(userData._tokenExpirationDate));

        if (loadedUser._token) {
            console.log(loadedUser._token);
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            console.log(new Date(userData._tokenExpirationDate).getTime());
            console.log(new Date().getTime());
            this.autoLogout(expirationDuration);
        }
    }

}
