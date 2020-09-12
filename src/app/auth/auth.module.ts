import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignUpWelcomeComponent } from './signupwelcome/signupwelcome.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthRouterModule } from './auth.router.module';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        AuthComponent,
        ProfileComponent,
        SignUpWelcomeComponent,
        AuthentificationComponent,
        ForgotpasswordComponent
    ],
    imports: [
        FormsModule,
        SharedModule,
        AuthRouterModule,
        MatIconModule,
        MatButtonModule
    ]
})

export class AuthModule {

}
