import { NgModule } from '@angular/core';
import { PostsRouterModule } from './posts.router.module';
import { SharedModule } from '../shared/shared.module';
import { PopularComponent } from './popular/popular.component';
import { TrendingComponent } from './trending/trending.component';
import { FreshComponent } from './fresh/fresh.component';

@NgModule({
    declarations: [PopularComponent, TrendingComponent, FreshComponent],
    imports: [
        SharedModule,
        PostsRouterModule
    ]
})

export class PostsModule {

}
