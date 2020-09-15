import { NgModule } from '@angular/core';
import { PostsRouterModule } from './posts.router.module';
import { SharedModule } from '../shared/shared.module';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';
import { PostsComponent } from './posts.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewComponent } from './new/new.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FreshCommentComponent } from './fresh/freshComments/freshComment.component';
import { TrendingCommentComponent } from './trending/trendingComments/trending.component';
import { PopularCommentComponent } from './popular/popularComments/popularComment.component';

@NgModule({
    declarations: [
        PostsComponent,
        PopularComponent,
        TrendingComponent,
        FreshComponent,
        NewComponent,
        FreshCommentComponent,
        TrendingCommentComponent,
        PopularCommentComponent
    ],
    imports: [
        FormsModule,
        ScrollingModule,
        SharedModule,
        ReactiveFormsModule,
        PostsRouterModule
    ],
    exports: [
        ScrollingModule,

    ]
})

export class PostsModule {

}
