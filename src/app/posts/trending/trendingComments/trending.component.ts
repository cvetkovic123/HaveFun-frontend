import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../../posts.service';

@Component({
    selector: 'app-trending-comment',
    templateUrl: './trending.component.html',
    styleUrls: ['./trending.component.scss']
})
export class TrendingCommentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() comments: any;
    // public commentHolder: any;
    public comment: any;
    public name: string;
    public newComment: string;
    public isLoading = false;
    public token: string;
    public postsId: string;
    public newCommentAdded = false;
    public postsIdWhichStaysAfterFirstCommentGetsPushed: string;
    public ifPostExists: boolean;
    public commentSubscription: Subscription;
    public userSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private postService: PostsService,
        private router: Router) {}

    ngOnInit(): void {

        // console.log('input comments', this.comments);
        this.userSubscription = this.authService.user.subscribe(user => {
            this.name = user.name;
            this.token = user._token;
        });

        this.commentSubscription = this.postService.trendingCommentsChanged.subscribe((result) => {
            console.log('result comments changed', result);
            this.comment = result;
        });
    }

    ngOnChanges(): void {
        if (!this.comments) {
            return;
        }
        console.log('comments', this.comments);
        this.postsId = this.comments.postsId;
        this.comment = (this.comments as any).comments;
        console.log('onLoad comments ngOnChanges', this.comment);

        // if (!this.comment) {
        //     this.postsId = (this.comments)._id;
        // }
        if (this.newCommentAdded) {
            return;
        }
        console.log(this.router.url !== '/fresh');
        if (this.router.url !== '/trending') {
            return;
        }
        this.postService.trendingCommentsChanged.subscribe((result) => {
            console.log('result comments changed', result);
            console.log('postsId', this.postsId);
            console.log('-----------------------------------------------');
            if (!result) {
                return;
            }
            // if (this.comments !== this.postsId) {
            //     return;
            // }
            // if (!(result as any).postsId) {
            //     return;
            // }
            this.comment = result;
        });
    }

    public onAddNewComment(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        console.log(form);
        const newComment = form.value.comment;
        console.log('this.comments.postsId', this.comments);
        console.log('new comment', newComment);
        console.log('token', this.token);
        this.postService.ifPostExists(this.comments._id, this.token)
            .subscribe((result => {
                console.log('result of ifPostExists', result);
                this.ifPostExists = (result as any).message;


                console.log('does ITITIT?!?!', this.ifPostExists);
                if (this.ifPostExists) {
                    this.postsId = this.comments._id;
                } else {
                    this.postsId = this.comments.postsId;
                }
                if (this.postsId) {
                    this.postsIdWhichStaysAfterFirstCommentGetsPushed = this.postsId;
                }
                if (!this.postsId) {
                    this.postsId = this.postsIdWhichStaysAfterFirstCommentGetsPushed;
                }
                this.postService.addNewCommentForThisPost(this.postsId, newComment, this.token)
                    .subscribe();
                this.newCommentAdded = true;
                form.reset();
            }), error => {
                console.log('error of ifPostExists', error);
            });

    }


    ngOnDestroy(): void {
        this.commentSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
    }
}
