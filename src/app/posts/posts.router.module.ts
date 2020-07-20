import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { PostsComponent } from './posts.component';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';

const routes: Routes = [
    { path: '', component: PostsComponent, children: [
        { path: 'popular', component: PopularComponent },
        { path: 'trending', component: TrendingComponent },
        { path: 'fresh', component: FreshComponent}
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PostsRouterModule {

}
