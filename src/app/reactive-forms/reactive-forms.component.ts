import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


import { Customer } from './customer';
@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent{
  customer: Customer = new Customer();


save(customerForm: NgForm) {
    console.log(customerForm.form);
    console.log('Saved: ' + JSON.stringify(customerForm.value));
}

}
