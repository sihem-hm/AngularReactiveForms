import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';
function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let emailControl = c.get('email');
  let confirmControl = c.get('confirmEmail');
  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmControl.value) {
      return null;
  }
  return { 'match': true };
}

function ratingRange(min: number, max: number): ValidatorFn {
  return  (c: AbstractControl): {[key: string]: boolean} | null => {
      if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
          return { 'range': true };
      };
      return null;
  };
}
@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent{
  customer: Customer = new Customer();
  customerForm: FormGroup;
  emailMessage: string;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');
  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.',
    minlength: 'Please enter at least 4 characters.'
};
get addresses(): FormArray{
  return <FormArray>this.customerForm.get('addresses');
}


constructor(private fb: FormBuilder) { }

ngOnInit(): void {
    this.customerForm = this.fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        emailGroup: this.fb.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            confirmEmail: ['', Validators.required],
        }, {validator: emailMatcher}),
        phone: '',
        notification: 'email',
        rating: ['', ratingRange(1, 5)],
        sendCatalog: true,
        addresses: this.fb.array([ this.buildAddress() ])
    });

    this.customerForm.get('notification').valueChanges
                     .subscribe(value => this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.debounceTime(1000).subscribe(value =>
        this.setMessage(emailControl));
}

addAddress(): void {
    this.addresses.push(this.buildAddress());
}

buildAddress(): FormGroup {
    return this.fb.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
    });
}

populateTestData(): void {
    this.customerForm.patchValue({
        firstName: 'Jack',
        lastName: 'Harkness',
        sendCatalog: false
    });
}

save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
}

setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
        this.emailMessage = Object.keys(c.errors).map(key =>
            this.validationMessages[key]).join(' ');
    }
}

setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
        phoneControl.setValidators(Validators.required);
    } else {
        phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
}
}
