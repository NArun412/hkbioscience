import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { must_match } from '../services/common-utlis.service';
import Swal from 'sweetalert2';
import { Buffer } from 'buffer';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  submitted = false;
  Reset_Password_Form: FormGroup | any;
  not_satisfy_password: boolean = false;
  matching_last_password: any = false;
  show_reset = true;
  show_info_message = false;
  link_not_valide = false;
  show_instruction_error: any;
  show_loading_btn = false;
  pass_set_failed = false;
  decrypted_email: string = "";
  param_email_id: string = "";
  param_token: string = "";userid: string = "";
  showNewPassword: boolean = false;
  showconfirmPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  constructor(private loginservice : LoginService,private activatedRoute: ActivatedRoute, private form: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.param_email_id = decodeURIComponent(params['EmailID']);
      this.decrypted_email = Buffer.from(this.param_email_id, 'base64').toString('binary');
      this.param_token = params['token'];
      this.userid = params['UserID'];
      localStorage.setItem('url_token',this.param_token);   
    });

    this.Reset_Password_Form = this.form.group({
      New_Password: ['', [Validators.required]],
      Confirm_Password: ['', Validators.required]
    }, {
      validator: must_match('New_Password', 'Confirm_Password')
    });
  }

    // Get form value for easy access
    get Reset_Password_Form_Value() { return this.Reset_Password_Form.controls; }


    
  //submit
  submit() {
    this.submitted = true;
    if (this.Reset_Password_Form.invalid) {
      return;
    }
    else {
      this.pattern_validation();
    }
  }


  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfimPasswordVisibility() {
    this.showconfirmPassword = !this.showconfirmPassword;
  }

  // password send API call
  password_send() {
    this.submitted = true;
    if (this.Reset_Password_Form.invalid) {
      return;
    }

    let domain_name = this.decrypted_email ;
    //let domain_name = 'theerthagiri.k@mahathiinfotech.com'
   
        let data2 = {
          "EmailAddress": domain_name,
          "NewPassword": this.Reset_Password_Form.value.New_Password,
          "UserID": this.userid
        }
        this.loginservice.Save_Password(data2).subscribe({
          next: (res: any) => {
            if (res.result) {
              localStorage.removeItem("url_token");
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");           
              Swal.fire({
                toast: true,
                position: "top",
                showConfirmButton: false,
                icon: 'success',
                timer: 3000,
                title: 'Password has been updated successfully. Please login to continue.',
              });
            } else {
              Swal.fire({
                toast: true,
                position: "top",
                showConfirmButton: false,
                icon: 'warning',
                timer: 3000,
                title: res.str_Message,
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401) {
              Swal.fire({
                toast: true,
                position: "top",
                showConfirmButton: false,
                icon: 'warning',
                timer: 3000,
                title: 'Your reset link has expired.',
              });
            }
          }
        });
  }


  // When user enter the patern it will check the validation 
  pattern_validation() {
    let valid_str = { "cap": 0, "small": 0, "num": 0, "spl": 0 };
    let isvalidpassword = 0;
    let newpassword = this.Reset_Password_Form.value.New_Password;
    if (newpassword.length >= 8) {
      for (let i = 0; i < newpassword.length; i++) {
        if (newpassword[i] >= 'A' && newpassword[i] <= 'Z') {
          valid_str.cap = 1;
        }
        else if (newpassword[i] >= 'a' && newpassword[i] <= 'z') {
          valid_str.small = 1;
        }
        else if (newpassword[i] >= '0' && newpassword[i] <= '9') {
          valid_str.num = 1;
        }
        else {
          valid_str.spl = 1;
        }
        if (valid_str.cap == 1 && valid_str.small == 1 && valid_str.num == 1 && valid_str.spl == 1) {
          isvalidpassword = 1;
          // console.log("Valid String");
          break;
        }
      }
    }
    if (isvalidpassword == 1) {
     
      this.password_send();
    }
    else {
     
      this.not_satisfy_password = true;
    }
  }



}
