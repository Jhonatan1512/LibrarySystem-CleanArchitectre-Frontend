import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.apiUrl}/Categoria`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
