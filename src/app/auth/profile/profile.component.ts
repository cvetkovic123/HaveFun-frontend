import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('basicModal', { static: true }) basicModal: ElementRef;

    public settingsShow = false;
    public userSub: Subscription;
    public profileSub: Subscription;
    public name: string;
    public _token: string;
    public email: string;

    public profileImage = '../../../assets/paperKit2/assets/img/no-avatar.jpg';

    public showMessagePasswordChange = true;
    public errorPasswordChange: string;
    public successPasswordChange: string;

    public showMessageImageUpload = true;
    public errorImageUpload: string;
    public successImageUpload: string;

    constructor(
            private authService: AuthService,
            private router: Router) {}
        ngOnInit(): void {

            this.userSub = this.authService.user.subscribe(user => {
                if (user !== null) {
                    this.email = user.email;
                    this.name = user.name;
                    this._token = user._token;
                }
            });
            this.profileSub = this.authService.profileImage.subscribe(image => {
                if (image === null) {
                    return;
                } else {
                    this.profileImage = (image as any);
                }
            });
        }

        public onUploadProfileImage(event: Event): void {
            const file = (event.target as HTMLInputElement).files[0];
            const title = file.name;
            this.authService.uploadProfileImage(file, title, this._token)
                .subscribe((result) => {
                    this.uploadImageErrorSuccess((result as any).message, '');
                    this.profileImage = (result as any).path;
                    this.authService.profileImage.next((this.profileImage) as any);
                }, (error) => {
                    this.uploadImageErrorSuccess('', error);
                    console.log('Error uploading profile image', error);
                });
        }

        public onEditName(event: Event, form: NgForm): void {
            if (!form.valid) {
                return;
            }
            this.authService.editName(this.name, this._token)
                .subscribe(() => {});
        }

        public onChangePassword(form: NgForm): void {
            const password = form.value.oldPassword;
            const newPassword = form.value.newPassword;
            this.authService.changePassword(this.email, password, newPassword, this._token)
                .subscribe((response) => {
                    this.changePasswordErrorSuccess((response as any).message, '');
                    form.reset();
                }, (error) => {
                    console.log('error', error);
                    this.changePasswordErrorSuccess('', error);
                });
        }

        public onDeleteProfile() {
            if (confirm('Are you sure you wish to delete your HaveFun Profile? Doing so will delete all your posts and data.')) {

                this.authService.deleteProfile(this._token)
                    .subscribe(() => {
                        this.basicModal.nativeElement.click();
                        this.authService.logout();
                    },
                    (error) => {
                        console.log('error', error);
                    });
            }
        }

        public changePasswordErrorSuccess(success: string, error: string) {
            this.showMessagePasswordChange = false;
            this.errorPasswordChange = error;
            this.successPasswordChange = success;
            setTimeout(() => {
                this.showMessagePasswordChange = true;
                this.errorPasswordChange = '';
                this.successPasswordChange = '';
            }, 5000);
        }


        public uploadImageErrorSuccess(success: string, error: string) {
            this.showMessageImageUpload = false;
            this.errorImageUpload = error;
            this.successImageUpload = success;
            setTimeout(() => {
                this.showMessageImageUpload = true;
                this.errorImageUpload = '';
                this.successImageUpload = '';
            }, 5000);
        }

        ngOnDestroy(): void {
            this.userSub.unsubscribe();
            this.profileSub.unsubscribe();
        }
}
