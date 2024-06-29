import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'http://localhost:3001/';  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getTopics(queryParams?: any): Observable<string[]> {
    let params = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.append(key, queryParams[key]);
        }
      }
    }

    return this.http.get<string[]>(this.apiUrl + "getTopics", { params });
  }

  postTopics(subscriptionData:any){
    return this.http.post(this.apiUrl + "subscribe",{subscriptionData});
  }

  deleteTopics(subscriptionData:any){
    return this.http.post(this.apiUrl + "unsubscribe",{subscriptionData});
  }

  requestTopics(newTopic:any){
    return this.http.post(this.apiUrl + "requestTopics" ,{newTopic});
  }
}
