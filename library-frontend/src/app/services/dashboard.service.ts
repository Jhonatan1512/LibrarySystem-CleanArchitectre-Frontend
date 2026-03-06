import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/Dashboard/resumen`;

  constructor(private http: HttpClient) { }

  getResumen(): Observable<any[]>{
    return this.http.get<[]>(this.apiUrl);
  }

}
