import { OnInit, Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { User } from 'src/app/auth/user.model';

@Component({
    selector: 'app-new-post',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss']
})

export class NewComponent implements OnInit, OnDestroy {

    public isLoading = false;
    public userSub: Subscription;
    public token: string;

    public imagePath;
    public imgURL: any;
    public message: string;

    constructor(private authService: AuthService, private postService: PostsService) {}

    ngOnInit() {
        this.userSub = this.authService.user.subscribe((result: User) => {
            this.token = result._token;
        });

    }



    public onCreateNewPost(form: NgForm, event: Event): void {
        this.isLoading = true;
        const title = form.value.title;
        const image = (event.target as HTMLInputElement)[1].files[0];
        const imageTitle = image.name;

        this.postService.newPost(title, imageTitle, image, this.token)
            .subscribe(result => {
                this.isLoading = false;
                console.log('result', result);
            }, error => {
                this.isLoading = false;
                console.log('error', error);
            });
    }




    public preview(event: Event) {
        const file = (event.target as HTMLInputElement).files;
        console.log(file);
        if ((file[0] as any).length === 0) {
            return;
        }

        const mimeType = file[0].type;
        if (mimeType.match(/image\/*/) == null) {
        this.message = 'Only images are supported.';
        return;
        }

        const reader = new FileReader();
        this.imagePath = file;
        reader.readAsDataURL(file[0]);
        reader.onload = (_event) => {
        this.imgURL = reader.result;
        };
    }


    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}

