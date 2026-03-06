import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class LibroService {
    private apiUrl = `${environment.apiUrl}/Libros`;

    constructor(private http: HttpClient){}

    buscarPorNombre(texto: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.apiUrl}/titulo/${texto}`);
    } 

    obtenerTodos(): Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl);
    }

    crearlibro(datos: any): Observable<any[]>{
        return this.http.post<any[]>(this.apiUrl, datos);
    }

    editarLibro(id: number, datos: any): Observable<any[]>{
        return this.http.put<any[]>(`${this.apiUrl}/${id}`, datos);
    }

    eliminarlibro(id: number): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    buscarLibro(titulo: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.apiUrl}/titulo/${titulo}`);
    }
}