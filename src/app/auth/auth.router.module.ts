import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { SignUpWelcomeComponent } from './signupwelcome/signupwelcome.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardOnlineService } from './auth-guard-online.service';

const authRoutes: Routes = [
    { path: '', component: AuthComponent, children: [
        { path: '', component: AuthentificationComponent },
        { path: 'activate', component: SignUpWelcomeComponent, children: [
            { path: ':id' }
        ]},
        { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardOnlineService] }
    ] }
];

@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class AuthRouterModule {

}
