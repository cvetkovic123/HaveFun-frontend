import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './posts.component';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';
import { NewComponent } from './new/new.component';
import { FreshCommentComponent } from './fresh/freshComments/freshComment.component';

const routes: Routes = [
    { path: '', component: PostsComponent, children: [
        { path: 'new', component:  NewComponent},
        { path: 'popular', component: PopularComponent },
        { path: 'trending', component: TrendingComponent },
        { path: 'fresh', component: FreshComponent, children: [
            { path: ':id', component: FreshCommentComponent},
        ]}
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PostsRouterModule {

}
