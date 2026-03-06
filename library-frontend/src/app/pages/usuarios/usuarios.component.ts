import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  isModalOpen: boolean = false;
  isEditing: boolean = false; 

  usuarios: any[] = [];

  nuevoLector = '';
  nuevoDni = '';

  idEliminar = '';

  usuarioSeleccionado = {
    id: 0,
    nombre: '',
    dni: ''
  };
  
  constructor(private usuarioService: UsuarioService){} 

  abrirModal(){
    this.isModalOpen = true;
    this.isEditing = false;
    this.usuarioSeleccionado = {id: 0, nombre: '', dni: ''};
  }

  cerrarModal(){
    this.isModalOpen = false;
  }

  ngOnInit(){
    this.cargarTodos();
  }

  cargarTodos(){
    this.usuarioService.ObtenerTodos().subscribe({
      next: (datos) => {
        this.usuarios = datos;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private alertService = inject(AlertService);

  guardarUsuario(){
    const nuvoUsuario = {
      nombre: this.usuarioSeleccionado.nombre,
      dni: this.usuarioSeleccionado.dni
    }

    if(this.usuarioSeleccionado.nombre.trim() == '' || this.usuarioSeleccionado.dni.trim() == '') 
      return this.alertService.warn('Todos los campos son obligatorios'); 
    if(this.isEditing){
      this.usuarioService.editarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
        .subscribe({
          next: () => {
            this.alertService.success('Cambios Guardados');
            this.cargarTodos();
            this.cerrarModal();
          },
          error: () => {
            this.alertService.error('Error al actualizar datos del usuario');
          }
        });
    } else {
      this.usuarioService.crearUsuario(nuvoUsuario)
        .subscribe({
          next: () => {
            this.alertService.success('Usuario creado Corretamente');
            this.cerrarModal();
            this.cargarTodos();
          },
          error: () => {
            this.alertService.error('Error al crear usuario');
          }
        });
    }
  }

  eliminarUsuario(id: number){
    this.alertService.confirm(
      '¿Eliminar Usuario?',
      'Esta acción no se puede deshacer'
    ).then((confirmado) => {
      if(confirmado){
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {          
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.alertService.success('Usuario Elimnado');
          },
          error: (err) => {
            this.alertService.error('Error al eliminar usuario');
          }
        });        
      }
    });
  }

  editarUsuario(usuario: any){
    this.isEditing = true;
    this.usuarioSeleccionado = { ...usuario};
    this.isModalOpen = true;
  }

  buscarUsuario(){
    if(!this.nuevoDni) return this.alertService.warn('Ingrese un DNI');

    this.usuarioService.buscarPorDni(this.nuevoDni).subscribe({
      next: (usuarioEncontrado) => {
        if(usuarioEncontrado){
          this.usuarios = [usuarioEncontrado];
          this.alertService.success('Usuario encontrado');
        } 
      },
      error: () => {
        this.alertService.warn('No se encontro ningún usuario con ese DNI');
      }
    });
  }

  limpiarBusqueda(){
    this.nuevoDni = '';
    this.cargarTodos();
  }
}
