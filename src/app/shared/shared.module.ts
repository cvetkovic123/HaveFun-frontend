import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidator } from './confirmEqualValidator.directive';
import { LoadingSpinnerComponent } from './loading-spiner/loading-spinner.component';
import { DateAgoPipe } from './dateAgo.pipe';

@NgModule({
    declarations: [
        ConfirmEqualValidator,
        LoadingSpinnerComponent,
        DateAgoPipe


    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        ConfirmEqualValidator,
        LoadingSpinnerComponent,
        DateAgoPipe
    ]
})

export class SharedModule {

}
