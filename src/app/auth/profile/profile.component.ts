import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
    public settingsShow = false;
    public userSub: Subscription;
    public profileSub: Subscription;
    public name: string;
    private token: string;
    public profileImage = '../../../assets/paperKit2/assets/img/no-avatar.jpg';


    constructor( private authService: AuthService) {}
        ngOnInit(): void {
            this.userSub = this.authService.user.subscribe(user => {
                if (user !== null) {
                    this.name = user.name;
                    this.token = user._token;
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

        public onSubmit(event: Event): void {
            const file = (event.target as HTMLInputElement).files[0];
            const title = file.name;
            this.authService.uploadProfileImage(file, title, this.token)
                .subscribe((result) => {
                    this.profileImage = (result as any).path;
                    this.authService.profileImage.next((this.profileImage) as any);
                });
        }

        ngOnDestroy(): void {
            this.userSub.unsubscribe();
            this.profileSub.unsubscribe();
        }
}
