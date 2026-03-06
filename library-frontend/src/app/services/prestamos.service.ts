import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs"; 
import { environment } from "../../environments/environment.development";

export interface GetPrestamoDto {
  id: number;
  nombreUsuario : string;
  fechaPrestamo : string;
  fechaDevolucion : string;
  fechaDevolucionReal: string;
  librosPrestados : string[];
} 

@Injectable({ 
  providedIn : 'root'
}) 
 
export class GetPrestamoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Prestamo`;

  obtenerPorDni(dni:string): Observable<GetPrestamoDto[]> { 
    const url = this.apiUrl + '/' + dni;
    return this.http.get<GetPrestamoDto[]>(url);
  }

  obtenerTodos(): Observable<GetPrestamoDto[]> {
    return this.http.get<GetPrestamoDto[]>(this.apiUrl);
  }

  crearPrestamo(datos: any): Observable<any>{
    return this.http.post(this.apiUrl, datos);
  }

  entregar(id: Number): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`,{});
  }
}

