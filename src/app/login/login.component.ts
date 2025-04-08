import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ɵGetProperty } from '@angular/forms';
import {email_validation } from 'src/app/services/common-utlis.service'
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public EnableForgot : boolean =false ;
  public EnableLogin : boolean =true ;
  Login_Form: FormGroup | any;
  email_id_EmailError = false;
  change_password_type: boolean = true;  
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  submitted: boolean = false;
  forgot_submitted: boolean = false;
  Forgot_Password: FormGroup | any;


  constructor(private loginservice : LoginService, private router:Router) { }

  ngOnInit(): void {
    localStorage.setItem('isUserLoggedIn', 'false');
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("Username") ; 
    localStorage.removeItem('SessionTime');
    this.initialize_form();
  }


  initialize_form() {
    this.Login_Form = new FormGroup({
      Email_Address: new FormControl('', [Validators.required,email_validation]),
      Password: new FormControl('',[Validators.required])
    });
  }

  get Login_Form_Value() { return this.Login_Form.controls; }


  OnBtnClick(flag:any) {
    if(flag =="Forgot")
    {
      this.EnableForgot = true;
      this.EnableLogin = false;
      this.forgot_submitted = false;
      this.init_form();
    }else if(flag =="Login")
    {
      this.EnableLogin = true;
      this.EnableForgot = false;
      this.submitted = false;
    }

  }


  login_clicked() {
    this.submitted = true;

    if (this.Login_Form.invalid) {
      return
    }
    else { 
        if (this.Login_Form.value.Email_Address && this.Login_Form.value.Password) {
          let data = {
            PasswordHash: this.Login_Form.value.Password,
            Username : this.Login_Form.value.Email_Address.trim(),         
          }
          this.loginservice.ValidateLogin(data).subscribe({
            next: (response: any) => {
              if (response.result == false) {
              //  this.toastr.warning(response.Message);
                let dt = response.str_Message;
                Swal.fire({
                  toast: true,
                  position:"top",
                  showConfirmButton: false,
                  icon: 'warning',
                  timer: 3000,
                  title: dt,
                });
              }
              else {
            //    this.toastr.success(response.Message);
            let dt = response.str_Message;
                Swal.fire({
                  toast: true,
                  position:"top",
                  showConfirmButton: false,
                  icon: 'success',
                  timer: 3000,
                  title: dt,
                });
                localStorage.setItem('isUserLoggedIn', 'true');  
                localStorage.setItem('access_token',response.access_Token);  
                localStorage.setItem('refresh_token',response.referesh_Token);                     
              
                localStorage.setItem('SessionTime',response.session_Timeout)  ;
                localStorage.setItem('Username', response.user_Name);
                this.router.navigate(['/Dashboard']);      
               
              }
              
            },
            error: (error: any) => {            
              console.error('There was an error!', error);
            }
          }
            
          );
    }
    }
  }


togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Get form value for easy access
  get Forgot_Password_Value() { return this.Forgot_Password.controls; }

  init_form()
  {
    this.Forgot_Password = new FormGroup({
      User_Email: new FormControl('', [Validators.required, email_validation]),
    });
  }

  // API call for send password
  send_reset_link() {
    
    this.forgot_submitted = true;

    if (this.Forgot_Password.invalid) {
      return;
    }
    else{
          let temp_encrypt = Buffer.from(this.Forgot_Password.value.User_Email.toString()).toString('base64')    
          let strURL = window.location.origin + "#/ResetPassword" + '/' +encodeURIComponent(temp_encrypt);
          let data2 = {
            "Email_Address": this.Forgot_Password.value.User_Email.toLowerCase().trim(),
            "Rest_Url": strURL,
          }
          this.loginservice.SentResetLink(data2).subscribe((res: any) => {
            if (res.result) {
           //   this.show_forgot_pass_field = false;
              //this.toastr.success('The requested password reset instructions have been sent to your specified email address');            
                Swal.fire({
                      toast: true,
                      position:"top",
                      showConfirmButton: false,
                      icon: 'success',
                      timer: 3000,
                      title: 'The requested password reset instructions have been sent to your specified email address',
                    });
             // this.show_message = true;
            }
            else {
              let msg =res.str_Message;         
              Swal.fire({
                toast: true,
                position:"top",
                showConfirmButton: false,
                icon: 'warning',
                timer: 3000,
                title: msg,
              });   
            }
          }, (_error: any) => {
            Swal.fire({
              toast: true,
              position:"top",
              showConfirmButton: false,
              icon: 'warning',
              timer: 3000,
              title: 'Something went wrong, Mail cannot be sent',
            });     
          })
    }
  }

}