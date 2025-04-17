import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HKBBlogComponent } from './hkb-blog/hkb-blog.component';
import { PlannerComponent } from './planner/planner.component';
import { FormsModule } from '@angular/forms';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule  } from 'ngx-bootstrap/dropdown';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http-service';
import { AuthInterceptor } from './services/http-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LoginComponent } from './login/login.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastrModule } from 'ngx-toastr';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductComponent } from './product/product.component';
import { BotTrainComponent } from './bot-train/bot-train.component';
import { ModalSpinnerComponent } from './modal-spinner/modal-spinner.component';
import { ContactComponent } from './Contact/contact.component';
import { ChatService } from './services/chat.service';
import { ChatBotPopupComponent } from './common/modal/chat-bot-popup/chat-bot-popup.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';
import { StepperComponent } from './stepper/stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export function tokenGetter() { 
  return localStorage.getItem("access_token"); 
}
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HKBBlogComponent,
    PlannerComponent,
    BlogPostComponent,
    LoginComponent,
    ResetPasswordComponent,
    ProductComponent,
    BotTrainComponent,
    ModalSpinnerComponent,
    ContactComponent,
    ChatBotPopupComponent,
    AddProductComponent,
    ProductViewComponent,
    CreateAccountComponent,
    BusinessFormComponent,
    VerifyEmailComponent,
    ThankYouComponent,
    CreateAccountFormComponent,
    StepperComponent
  ],
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule,
    BsDropdownModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule,
    FontAwesomeModule,
    NgbModule,
   JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
       // allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    HttpService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {constructor(library: FaIconLibrary) {
  // Add icons to the library
  library.addIcons(faEye, faEyeSlash);

} }
