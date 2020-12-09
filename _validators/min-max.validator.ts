import { AbstractControl } from '@angular/forms';
export class MinMaxValidation {
  static checkYears(control: AbstractControl) {
    let yearMin = control.get('yearMin').value;
    let yearMax = control.get('yearMax').value;
    if (parseInt(yearMin) > parseInt(yearMax)) {
      control.get('yearMax').setErrors({ yearMax: true });
    }
    else {
      return null;
    }
  }

  static checkSalary(control: AbstractControl) {
    let salMin = control.get('salMin').value;
    let salMax = control.get('salMax').value;
    if (parseFloat(salMin) > parseFloat(salMax)) {
      control.get('salMax').setErrors({ salMax: true });
    }
    else {
      return null;
    }
  }

}