import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appConfirmEqualValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ConfirmEqualValidator,
        multi: true
    }]
})
export class ConfirmEqualValidator implements Validator {
    @Input() appConfirmEqualValidator: string;
    validate(control: AbstractControl): {[key: string]: any} | null {
        // controlToCompare is the password field
        const controlToCompare = control.parent.get(this.appConfirmEqualValidator);
        if (controlToCompare && controlToCompare.value !== control.value) {
            return { notEqual: true};
        }

        return null;
    }

}
