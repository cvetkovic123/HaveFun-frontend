import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidator } from './confirmEqualValidator.directive';
import { LoadingSpinnerComponent } from './loading-spiner/loading-spinner.component';

@NgModule({
    declarations: [
        ConfirmEqualValidator,
        LoadingSpinnerComponent,


    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        ConfirmEqualValidator,
        LoadingSpinnerComponent
    ]
})

export class SharedModule {

}
