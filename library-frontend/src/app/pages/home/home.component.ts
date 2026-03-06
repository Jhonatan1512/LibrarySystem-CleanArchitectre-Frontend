import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  stats: any = {
    totalLibros: 0,
    prestamosActivos: 0,
    lectoresRegistrados: 0,
    categoriasMasPrestadas: []
  }

  loading: boolean = true;

  constructor(private dashboarSevice: DashboardService){}

  ngOnInit() {
      this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.loading = true;
    this.dashboarSevice.getResumen().subscribe({
      next: (data: any) => {
        const ordenados = data.categoriasMasPrestadas || [];
        this.stats = {
          ...data,
          categoriasMasPrestadas: this.reordenarParaCentro(ordenados)
        };
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  reordenarParaCentro(array: any[]): any[] {
    const resultado: any[] = [];
    const ordenados = [...array].sort((a, b) => b.porcentaje - a.porcentaje);

    ordenados.forEach((item, index) => {
      if (index % 2 === 0) {
        resultado.push(item); 
      } else {
        resultado.unshift(item); 
      }
    });
    return resultado;
  }
}

