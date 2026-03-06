import { LibroService } from '../../services/libro.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';


@Component({
  selector: 'app-libros',
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnInit {
  isModalOpen: boolean = false;
  isEditing: boolean = false;

  libros: any[] = [];

  categorias: any[] = [];

  nuevotitulo = '';
  nuevoAutor = '';
  nuevoStock = 1;
  categoriaId = 1;

  libroSeleccionado = {
    id: 0,
    titulo: '',
    autor: '',
    stock: 0,
    categoriaId: 0
  };

  constructor(
    private libroService: LibroService,
    private categoriaService: CategoriaService
  ){}

  cerrarModal(){
    this.isModalOpen = false;
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  ngOnInit(){
    this.CargarTodos();
    this.obtenerCategorias();
  }

  CargarTodos(){
    this.libroService.obtenerTodos().subscribe({
      next: (datos) => {
        this.libros = datos;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  obtenerCategorias(){
    this.categoriaService.obtenerTodos().subscribe({
      next: (datos) => {
        this.categorias = datos;
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  private alertService = inject(AlertService);

  guadarLibro(){
    if(!this.libroSeleccionado.titulo || !this.libroSeleccionado.autor || !this.libroSeleccionado.stock || !this.libroSeleccionado.categoriaId) 
      return this.alertService.warn('Todos los campos son obligatorios'); 
    const nuevolibro = {
      titulo: this.libroSeleccionado.titulo,
      autor: this.libroSeleccionado.autor,
      stock: this.libroSeleccionado.stock,
      categoriaId: this.libroSeleccionado.categoriaId
    }

    if(this.isEditing){
      this.libroService.editarLibro(this.libroSeleccionado.id, this.libroSeleccionado)
        .subscribe({
          next: () => {
            this.alertService.success('Cambios Guardados');
            this.cerrarModal();
            this.CargarTodos(); 
          },
          error: () => {
            this.alertService.error('Error al actualizar datos del libro');
          }
        })
    } else {
      this.libroService.crearlibro(nuevolibro).subscribe({
        next: () => {
          this.alertService.success('Libro Creado')
          this.cerrarModal();
          this.CargarTodos();        
        },
        error: () => {
          this.alertService.error('Error al Crear libro');
        }
      });
    }
  }

  modificarLibro(usuario: any){
    this.isEditing = true;
    this.libroSeleccionado = {...usuario};
    this.isModalOpen = true;
  }

  eliminarLibro(id: number){
    this.alertService.confirm(
      '¿Estas seguro de eliminar este libro?',
      'Esta acción no se puede deshacer'
    ).then((confirmado)=> {
      this.libroService.eliminarlibro(id).subscribe({
        next: () => {
          this.libros = this.libros.filter(l => l.id !== id);
          this.alertService.success('Libro eliminado Corectamente');
        }, error: () => {
          this.alertService.error('error al eliminar libro');
        }
      })
    });
  }

  buscarLibro(){
    if(!this.nuevotitulo) return this.alertService.warn('Ingrese el titulo del libro');

    this.libroService.buscarLibro(this.nuevotitulo).subscribe({
      next: (libroEncontrado) => {
        if(libroEncontrado){
          this.libros = libroEncontrado;
        }
      },
      error: () => {
        this.alertService.warn('No hay libros con este título');
      }
    });
  }

  limpiarBusqueda(){
    this.nuevotitulo = '';
    this.CargarTodos();
  }
}
