import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../Model/Category';
import {HttpService} from '../services/http-service'   
import { ProductFetch } from '../../Model/ProductFetch'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(@Inject(HttpService) private httpservice: HttpService) {}

  DeleteProductPost(Postid: number) {
    const DeleteProductPost = `Product/DeleteProductPost?Postid=${Postid}`;
    return this.httpservice.get<any>(DeleteProductPost); 
  }

  UpdateProductPost(formData: FormData) {
    const UpdateProductPost= 'Product/UpdateProductPost';
    return this.httpservice.post<any>(UpdateProductPost, formData);
  }

  AddProduct(formData: FormData): Observable<any> {
    const AddProductAPI= 'Product/AddProduct';
    return this.httpservice.post<any>(AddProductAPI, formData);
  }

  CategoryDropdownAPI= 'Product/CategoryDropdown';
  getCategories():Observable<Category[]> {
    return this.httpservice.get<Category[]>(this.CategoryDropdownAPI);
  }
  
  FetchProductPost(Flagid?:number): Observable<ProductFetch[]> {
    let FetchProductPostAPI:any= 'Product/FetchProductPost';
    if(Flagid)
    {
      FetchProductPostAPI= `Product/FetchProductPost?Flagid=${Flagid}`;
    }
    return this.httpservice.get<ProductFetch[]>(FetchProductPostAPI);
  }
}
