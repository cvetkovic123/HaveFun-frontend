import { AuthComponent } from './auth.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignUpWelcomeComponent } from './signupwelcome/signupwelcome.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './profile/settings/settings.component';

const authRoutes: Routes = [
    { path: '', component: AuthComponent, children: [
        { path: '', component: AuthentificationComponent },
        { path: 'activate', component: SignUpWelcomeComponent,  children: [
            { path: ':id' }
        ]},
        { path: 'profile', component: ProfileComponent, children: [
            { path: 'settings', component: SettingsComponent}
        ]}
    ] }
];

@NgModule({
    declarations: [
        AuthComponent,
        ProfileComponent,
        SettingsComponent,
        SignUpWelcomeComponent,
        AuthentificationComponent
    ],
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
