import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Configuración base para todos los Toasts
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    color: '#ffffff',
    iconColor: '#ffffff',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  constructor() { }

  // Método para éxito
  success(message: string) {
    this.Toast.fire({
      icon: 'success',
      title: message,
      background: '#28a745'
    });
  }

  // Método para errores
  error(message: string = 'Hubo un error en el servidor') {
    this.Toast.fire({
      icon: 'error',
      title: message,
      background: '#dc3545'
    });
  }

  // Método para advertencias
  warn(message: string) {
    this.Toast.fire({
      icon: 'warning',
      title: message,
      background: '#ffc107',
      color: '#000000', 
      iconColor: '#000000'
    });
  }

  // Bonus: Una alerta de confirmación (no es toast, pero es útil)
  async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }
}