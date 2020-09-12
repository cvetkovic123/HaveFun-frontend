import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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

    public backendGoogleSignIn() {
        // const headers = new HttpHeaders();
        // headers.append('access-control-allow-origin', 'http://localhost:3300/users/auth/google');
        // return this.http.get(environment.api_key + '/users/auth/google',
        // {
        //     headers: new HttpHeaders()
        //         .append('credentials', 'include'),
        // },
        // )
        //     .pipe(
        //         tap((resData) => {
        //             console.log('googleRes', resData);
        //             catchError(this.handleError);
        //         })
        //     );
        // window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'new');
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
                    authorization: token

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

    public resendEmail(email: string, password: string): Observable<object> {
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


    public forgotPassword(email: string) {
        return this.http.post(
            environment.api_key + '/users/forgotPassword',
            {
                email
            }
        ).pipe(
            catchError(this.handleError)
        );
    }

    public forgotChangePassword(email: string, newPassword: string, token: string): Observable<object> {
        return this.http.patch(
            environment.api_key + '/users/forgotChangePassword',
            {
                email,
                newPassword
            },
            {
                headers: new HttpHeaders({
                    authorization: token
                })
            }
        ).pipe(
            catchError(this.handleError)
        );
    }


    public editName(name: string, token: string): Observable<object> {
        return this.http.patch(environment.api_key + '/users/editName',
        {
            name
        },
        {
            headers: new HttpHeaders({
                authorization: token
            })
        });
    }

    public getName(token: string): Observable<object> {
        return this.http.get(environment.api_key + '/users/getName',
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }).pipe(
            catchError(this.handleError)
        );
    }

    public changePassword(email: string, password: string, newPassword: string, token: string) {
        return this.http.patch(environment.api_key + '/users/changePassword',
        {
            email,
            password,
            newPassword
        },
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }).pipe(
            catchError(this.handleError)
        );
    }


    public deleteProfile(token: string): Observable<object> {
        return this.http.delete(environment.api_key + '/users/deleteProfile',
        {
            headers: new HttpHeaders({
                authorization: token
            })
        }).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';

        if (typeof errorResponse.error === 'string') {
            if (errorResponse.error.startsWith('<!DOCTYPE')) {
                console.log('true');
                const paragraph = errorResponse.error;
                const regex = /<pre>(.*?)<\/pre>/;
                this.errorEmailCatcher = paragraph.match(regex);
            }
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
            case 'Old password not correct!':
                errorMessage = 'Current password is not correct!';
                break;

        }
        if (this.errorEmailCatcher) {
            if (this.errorEmailCatcher[1].startsWith('Error: Invalid mime type')) {
                errorMessage = 'You can only upload files with jpg, jpeg and png format.';
            } else {
                errorMessage = this.errorEmailCatcher[1];
            }
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
        const timeOut = expirationDuration - new Date().getTime();
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, timeOut);
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
        // console.log('AutoLogin started');
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

        this.getName(userData._token).subscribe(() => {});

        const loadedUser = new User(
            userData.iss,
            userData.sub,
            userData.name,
            userData.email,
            userData._token,
            new Date(userData._tokenExpirationDate));

        if (loadedUser._token) {
            // console.log(loadedUser._token);
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime();
            // console.log(new Date(userData._tokenExpirationDate).getTime());
            // console.log(new Date().getTime());
            this.autoLogout(expirationDuration);
        }
    }

}
