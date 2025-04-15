import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HKBBlogComponent } from './hkb-blog/hkb-blog.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { PlannerComponent } from 'src/app/planner/planner.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {ProductComponent} from './product/product.component';
import {BotTrainComponent} from './bot-train/bot-train.component';
import { ContactComponent } from './Contact/contact.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { BusinessFormComponent } from './business-form/business-form.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/Dashboard',
    pathMatch: 'full'
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    data: { pageName: 'Home' }
  },
  {
    path: 'Product',
    component: ProductComponent,
    data: { pageName: 'Product' }
  },
  {
    path: 'Plan',
    component: PlannerComponent,
    data: { pageName: 'Plan' }
  },
  {
    path: 'Contact',
    component: ContactComponent,
    data: { pageName: 'Contact' }
  },
  {
    path: 'HKBBlog',
    component: HKBBlogComponent,
    data: { pageName: 'Blog' }
  },
  {
    path: 'BlogPost',
    component: BlogPostComponent,
    data: { pageName: 'Add Blog' }
  },{
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: 'ResetPassword/:EmailID/:UserID/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'TrainBot',
    component: BotTrainComponent,
    data: { pageName: 'Train me' }
  },
  {
    path: 'AddProduct',
    component: AddProductComponent,
    data: { pageName: 'Add Product' }
  },
  {
    path: 'ViewProduct',
    component: ProductViewComponent,
    data: { pageName: 'View Product' }
  },
  {
    path: 'BusinessForm',
    component: BusinessFormComponent,
    data: { pageName: 'Business Form' }
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash:true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
