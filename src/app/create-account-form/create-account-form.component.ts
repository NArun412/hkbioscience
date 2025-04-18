import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.css']
})
export class CreateAccountFormComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // companyName: ['', Validators.required],
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      // phone: ['+1', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', Validators.required],
      // confirmPassword: ['', Validators.required],
      // agreeTerms: [false, Validators.requiredTrue],
      // receiveEmails: [false],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
    }
  }

}
