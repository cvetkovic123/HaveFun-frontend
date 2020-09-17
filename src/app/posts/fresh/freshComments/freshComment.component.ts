import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../../posts.service';

@Component({
    selector: 'app-fresh-comment',
    templateUrl: './freshComment.component.html',
    styleUrls: ['./freshComment.component.scss']
})
export class FreshCommentComponent implements OnInit, OnDestroy {
    public comments: any;
    public name: string;
    public postTitle: string;
    public isLoading = true;
    public token: string;
    public postId: string;
    // private commentSubscription: Subscription;
    private userSubscription: Subscription;


    constructor(
        private authService: AuthService,
        private postService: PostsService,
        private route: ActivatedRoute) {}
    ngOnInit(): void {


        this.userSubscription = this.authService.user.subscribe(user => {
            this.token = user._token;
            this.name = user.name;
        });


        this.route.paramMap.subscribe(params => {
            console.log(params);
            const postId = params.get('id');

            this.postId = postId;
            this.getComments(postId);
        });


        this.postService.commentsChanged.subscribe(result => {
            if (!result) {
                return;
            }
            console.log('freshCommentsChanged', result);
            this.isLoading = false;
            this.comments = result;
        });

    }




    public onAddNewComment(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        const newComment = form.value.comment.toString().trim();

        this.postService.addNewCommentForThisPost(this.postId, newComment, this.token)
            .subscribe();
        form.reset();

    }

    public getComments(id: string) {
        if (!id) {
            return;
        }
        console.log('getPostComment', id);
        this.postService.getAllCommentsForThisPost(id, this.token)
            .subscribe();
    }


    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

}
