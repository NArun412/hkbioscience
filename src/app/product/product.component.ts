import { Component, OnInit } from '@angular/core';
import { ProductFetch } from 'src/Model/ProductFetch';
import { SharedService } from '../../../src/app/services/shared.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isUserLoggedIn:boolean=false;
  productPosts: ProductFetch[] = []; 
  Firstproductshow: ProductFetch[] = [];
  ShowMorebtn: boolean=true;
  ShowItemcount:number=8;
  Category:any;
  constructor(private sharedService: SharedService,private productService :ProductService,private router: Router) { }


  ngOnInit(): void {
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
    this.Category = this.sharedService.getData();
    this.productService.FetchProductPost().subscribe(
      data => {
        this.productPosts = data
        
        if(this.Category)
        {
          this.Firstproductshow = data.filter(x=>x.categoryName===this.Category.name)
        }
        else
        {
          this.Firstproductshow = data.slice(0, this.ShowItemcount);
        }
       
      }
    )
  }

  showmore() {
    this.Firstproductshow = this.productPosts;
    }

    RedirectProduct(UploadID: number) {
      this.sharedService.setData({ id: UploadID }); // Set data
       this.router.navigate(['/ViewProduct']);
      }

}
