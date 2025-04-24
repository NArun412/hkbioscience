import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your account has been successfully created.',
        confirmButtonColor: '#ED4D1A'
      }).then(() => {
        console.log(this.form.value);
        this.router.navigate(['/VerifyEmail']);
      });
    } else {
      this.form.markAllAsTouched();
  
      // Collect missing fields (optional enhancement)
      const errorFields = [];
      if (this.form.get('companyName')?.invalid) errorFields.push('Company Name');
      if (this.form.get('firstName')?.invalid) errorFields.push('First Name');
      if (this.form.get('lastName')?.invalid) errorFields.push('Last Name');
      if (this.form.get('phone')?.invalid) errorFields.push('Phone');
      if (this.form.get('email')?.invalid) errorFields.push('Email');
      if (this.form.get('password')?.invalid) errorFields.push('Password');
      if (this.form.get('confirmPassword')?.invalid) errorFields.push('Confirm Password');
      if (this.form.hasError('passwordMismatch')) errorFields.push('Passwords must match');
      if (this.form.get('agreeTerms')?.invalid) errorFields.push('Agree to Terms');
  
      Swal.fire({
        icon: 'error',
        title: 'Form Incomplete',
        html: `
          Please correct the following issues:<br><br>
          <strong>${errorFields.join(', ')}</strong>
        `,
        confirmButtonColor: '#ED4D1A'
      });
    }
  }
  

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.form.valid) {
  //     alert('Form submitted successfully!');
  //     console.log(this.form.value);
  //     this.router.navigate(['/VerifyEmail']); // Navigate here
  //   } else {
  //     this.form.markAllAsTouched();
  //   }
  // }
}
