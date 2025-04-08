import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 
 
@Injectable()
export class HttpService {
    url: string;
    constructor(public http: HttpClient) {
        // this.url = "http://localhost:5159/api/"; --- Use for localhost...
        this.url = "api/api/";
    }
 
    get<T>(apiRoute: string):Observable<T> {
        return this.http.get<T>(`${this.url + apiRoute}`);
    }
 
    delete(apiRoute: string) {
        return this.http.delete(`${this.url + apiRoute}`);
    }
 
    post<T>(apiRoute: string, body: any):Observable<T> {
        return this.http.post<T>(`${this.url + apiRoute}`, body);
    }
 
}