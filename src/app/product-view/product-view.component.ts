import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ProductService } from '../services/product.service';
import { ProductFetch } from 'src/Model/ProductFetch';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  @ViewChild('targetElement') targetElement!: ElementRef;
  uploadId:any;
  productPosts: ProductFetch[] = []; 
  Firstproductshow: ProductFetch[] = [];
  smiliarproductshow: ProductFetch[] = [];
  imagepath:string="";
  productname:string="";
  subtitle:string="";
  description:string="";
  category:any;
  constructor(private sharedService: SharedService,private productService :ProductService
    ,private router: Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.uploadId = this.sharedService.getData();
    this.productService.FetchProductPost().subscribe(
      data => {
        this.productPosts = data
        if(data)
        {
          if(this.uploadId)
          {
            this.Firstproductshow = data.filter(x=>x.uploadId===this.uploadId.id);
          }
          else
          {
            this.Firstproductshow=data.filter(x=>x.uploadId===data[0].uploadId);
          }
           this.imagepath=  this.Firstproductshow[0].filePath;
           this.productname =  this.Firstproductshow[0].productName;
           this.subtitle=this.Firstproductshow[0].subTitle;
           this.description=this.Firstproductshow[0].description;
           this.description=this.Firstproductshow[0].description;
           this.category= this.Firstproductshow[0].categoryID;
        this.smiliarproductshow=  data.filter(x=>x.categoryID!=this.category).slice(0, 4);
      }

      }
    )
  }

  RedirectProduct(UploadID: number) {
   const data =  this.productPosts;
   this.Firstproductshow = data.filter(x=>x.uploadId===UploadID);
           this.imagepath=  this.Firstproductshow[0].filePath;
           this.productname =  this.Firstproductshow[0].productName;
           this.subtitle=this.Firstproductshow[0].subTitle;
           this.description=this.Firstproductshow[0].description;
           this.category= this.Firstproductshow[0].categoryID;

           this.smiliarproductshow=  data.filter(x=>x.categoryID!=this.category).slice(0, 4);   
           setTimeout(() => { this.scrollToSection()
           }, 100);
    }


    scrollToSection() {
      if (this.targetElement) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling
          });
        }, 50);
    
      }
    }

    getDescription(): SafeHtml {
      let content = this.description;
      
      return this.sanitizer.bypassSecurityTrustHtml(content);
    }


}
