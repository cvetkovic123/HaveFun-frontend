import { AuthComponent } from './auth.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const authRoutes: Routes = [
    { path: '', component: AuthComponent}
];

@NgModule({
    declarations: [AuthComponent],
    imports: [
        FormsModule,
        SharedModule,
        RouterModule.forChild(authRoutes)
    ],
    exports: [
        AuthComponent,
        FormsModule,
        RouterModule
    ]
})

export class AuthModule {

}
