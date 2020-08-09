import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignUpWelcomeComponent } from './signupwelcome/signupwelcome.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthRouterModule } from './auth.router.module';



@NgModule({
    declarations: [
        AuthComponent,
        ProfileComponent,
        SignUpWelcomeComponent,
        AuthentificationComponent,
    ],
    imports: [
        FormsModule,
        SharedModule,
        AuthRouterModule
    ]
})

export class AuthModule {

}
