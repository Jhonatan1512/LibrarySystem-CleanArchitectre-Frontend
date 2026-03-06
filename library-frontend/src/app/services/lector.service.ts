import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class LectorService {
    private apiUrl = `${environment.apiUrl}/Usuario/dni`;

    constructor(private http: HttpClient){}

    buscarPorDni(dni: string): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/${dni}`);
    }
}