import { NgModule } from '@angular/core';
import { PostsRouterModule } from './posts.router.module';
import { SharedModule } from '../shared/shared.module';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';
import { PostsComponent } from './posts.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PostsComponent,
        PopularComponent,
        TrendingComponent,
        FreshComponent
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        PostsRouterModule
    ]
})

export class PostsModule {

}
