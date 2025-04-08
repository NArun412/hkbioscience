import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../services/http-service'
import { Planner } from '../../Model/Planner';


@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  constructor(@Inject(HttpService) private httpservice: HttpService, private http: HttpClient) { }
  SavePlannerAPI = 'Planner/SavePlanner';

  submitPlannerData(plannerData: Planner): Observable<any> {
    return this.httpservice.post<any>(this.SavePlannerAPI, plannerData);
  }

  SentEmailAPI = 'Contact/SentEmail';
  sentemail(plannerData:Planner): Observable<any> {
    return this.httpservice.post<any>(this.SentEmailAPI, plannerData);
  }
}

