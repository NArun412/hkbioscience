import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.css']
})
export class CreateAccountFormComponent {
  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group(
      {
        companyName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)] // 10-digit only
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        agreeTerms: [false, Validators.requiredTrue],
        receiveEmails: [false],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      alert('Form submitted successfully!');
      console.log(this.form.value);
      this.router.navigate(['/VerifyEmail']); // Navigate here
    } else {
      this.form.markAllAsTouched();
    }
  }
}
