import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './posts.component';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';
import { NewComponent } from './new/new.component';
import { FreshCommentComponent } from './fresh/freshComments/freshComment.component';
import { TrendingCommentComponent } from './trending/trendingComments/trending.component';
import { PopularCommentComponent } from './popular/popularComments/popularComment.component';

const routes: Routes = [
    { path: '', component: PostsComponent, children: [
        { path: 'new', component:  NewComponent},
        { path: 'popular', component: PopularComponent, children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: ':id', component: PopularCommentComponent }
        ] },
        { path: 'trending', component: TrendingComponent, children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: ':id', component: TrendingCommentComponent }
        ] },
        { path: 'fresh', component: FreshComponent, children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: ':id', component: FreshCommentComponent },
        ]}
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PostsRouterModule {

}
