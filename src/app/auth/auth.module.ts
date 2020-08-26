import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignUpWelcomeComponent } from './signupwelcome/signupwelcome.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthRouterModule } from './auth.router.module';


import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';


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
        AuthRouterModule,
        SocialLoginModule
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '161515845862-moreq9nlsr0csk5n5c33acqm79q59jl2.apps.googleusercontent.com'
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(
                            '2688494098106310'
                        ),
                    },
                ],
            } as SocialAuthServiceConfig,
        }
    ]
})

export class AuthModule {

}
