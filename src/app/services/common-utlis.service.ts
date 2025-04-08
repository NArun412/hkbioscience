import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
@Injectable({
  providedIn: 'root'
})
export class CommonUtlisService {

  constructor() { }
}


// Email validation on keypress
export function email_validation(control: FormControl) {
    if ((control == undefined || control == null) || (control && (control.value == undefined || control.value == null)) || (control && control.value && control.value.toString() == '')) {
      return null;
    }
    let regex: RegExp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    const WithoutWhitespace = control && control.value && control.value.toString() != '' ? control.value.toString().trim() : '';
    if (WithoutWhitespace != '') {
      if (WithoutWhitespace.match(regex)) {
        return null;
      } else {
        return { 'Validemail': true };
      }
    } else {
      return null;
    }
  }

  export function must_match(control_name: string, matching_control_name: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[control_name];
        const matching_control = formGroup.controls[matching_control_name];

        if (matching_control.errors && !matching_control.errors['mustMatch']) {
            // return if another validator has already found an error on the matching_control
            return;
        }

        // set error on matching_control if validation fails
        if (control.value !== matching_control.value) {
            matching_control.setErrors({ mustMatch: true });
        } else {
            matching_control.setErrors(null);
        }
    }
}