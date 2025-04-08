import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../Model/Category';
import {HttpService} from '../services/http-service'   
import { BlogFetchModel } from '../../Model/BlogFetchModel';


@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(@Inject(HttpService) private httpservice: HttpService) {}
  DeleteBlogPost(Postid: number) {
    const DeleteBlogPostAPI = `Blog/DeleteBlogPost?Postid=${Postid}`;
    return this.httpservice.get<any>(DeleteBlogPostAPI); 
  }

  updateBlogPost(formData: FormData) {
    const UpdateBlogPostAPI= 'Blog/UpdateBlogPost';
    return this.httpservice.post<any>(UpdateBlogPostAPI, formData);
  }
  createBlogPost(formData: FormData): Observable<any> {
    const createBlogPostAPI= 'Blog/CreateBlogpost';
    return this.httpservice.post<any>(createBlogPostAPI, formData);
  }
  CategoryDropdownAPI= 'Blog/CategoryDropdown';
  getCategories():Observable<Category[]> {
    return this.httpservice.get<Category[]>(this.CategoryDropdownAPI);
  }
  
 
 
  getBlogPosts(Flagid?:number): Observable<BlogFetchModel[]> {
    let FetchBlogpostAPI:any= 'Blog/FetchBlogpost';
    if(Flagid)
    {
         FetchBlogpostAPI= `Blog/FetchBlogpost?Flagid=${Flagid}`;
    }
    return this.httpservice.get<BlogFetchModel[]>(FetchBlogpostAPI);
  }
}
