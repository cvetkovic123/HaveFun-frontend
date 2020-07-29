import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidator } from './confirmEqualValidator.directive';

@NgModule({
    declarations: [
        ConfirmEqualValidator,

    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        ConfirmEqualValidator
    ]
})

export class SharedModule {

}
