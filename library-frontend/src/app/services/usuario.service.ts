import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface GetUsuarioDto{
  id: number,
  nombre: string,
  dni: string
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  
  private urlApi = `${environment.apiUrl}/Usuario`;

  ObtenerTodos(): Observable<GetUsuarioDto[]> {
    return this.http.get<GetUsuarioDto[]>(this.urlApi);
  }

  crearUsuario(datos: any): Observable<any>{
    return this.http.post(this.urlApi, datos);
  }

  eliminarUsuario(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }

  editarUsuario(id: number, datos: any): Observable<any[]>{
    return this.http.put<any[]>(`${this.urlApi}/${id}`, datos);
  }

  buscarPorDni(dni: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlApi}/dni/${dni}`);
  }
}
