import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GetPrestamoService } from '../../services/prestamos.service';
import { LectorService } from '../../services/lector.service';
import { LibroService } from '../../services/libro.service';
import { AlertService } from '../../services/alert.service';

@Component({ 
  selector: 'app-root',
  standalone : true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.css'
})

export class PrestamosComponent implements OnInit {

  dniBusqueda: string = '';
  prestamos: any[] = [];
  mensajeError: string = '';
  busquedaActiva: boolean = false;
  isModalOpen: boolean = false;

  nuevoDniLector: string = '';
  nuevoNombreLector: string = '';
  nuevoIdLector: number | null = null;

  busquedaLibroTexto: string = '';
  librosSugeridos: any[] = [];
  libroSeleccionado: any[] = [];

  diasPrestamo: number = 7;
  mensajeModal: string = '';

  constructor(
    private prestamoService: GetPrestamoService,
    private lectorService: LectorService,
    private libroService: LibroService
  ){}

  ngOnInit() {
    this.cargarTodos();
  }

  cargarTodos() {
    this.busquedaActiva = false;
    this.mensajeError = ''; 
    
    this.prestamoService.obtenerTodos().subscribe({
      next: (datos) => {
        this.prestamos = datos;
      },
      error: (err) => console.error('Error al cargar todos:', err)
    });
  }

  //función para buscar 
  buscarPrestamo(){
    const dni = String(this.dniBusqueda || '').trim();
    if(dni === '') {
      //console.log("DNI: ", this.dniBusqueda)
      this.cargarTodos();
      return;
    }

    this.busquedaActiva = true;
    this.mensajeError = '';

    //llamamos a la api
    this.prestamoService.obtenerPorDni(this.dniBusqueda).subscribe({
      next: (datos) => {
        //console.log("Datos recividos", datos);
        this.prestamos = datos;
        if(datos.length === 0){
          this.mensajeError = 'No se encontraron préstamos para este DNI';
        }
      },
      error: (err) => {
        this.mensajeError = 'Error al buscar DNI';
      }
    });
  }

  limpiarFiltro() {
    this.dniBusqueda = '';
    this.cargarTodos();
  }

  abrirModal() {
    this.isModalOpen = true;
    this.resetFormularioModal();
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  resetFormularioModal(){
    this.nuevoDniLector = '';
    this.nuevoNombreLector = '';
    this.busquedaLibroTexto = '';
    this.librosSugeridos = [];
    this.libroSeleccionado = [];
    this.diasPrestamo = 7;
    this.mensajeModal = '';
  }

  buscarLectorNuevo(){
    if(!this.nuevoDniLector) return
    
    this.mensajeModal = 'buscando usuario...';

    this.lectorService.buscarPorDni(this.nuevoDniLector).subscribe({ 
      next: (lectorEncontrado) => {
        if(lectorEncontrado){
          this.nuevoNombreLector = lectorEncontrado.nombre;
          this.nuevoIdLector = lectorEncontrado.id
          this.mensajeModal = ''
        } else {
          this.nuevoNombreLector = '',
          this.mensajeModal = 'Lector no encontrado en la base de datos'
        }
      },
      error: (err) => {
        console.log(err);
        this.nuevoNombreLector = '';
        this.mensajeModal = 'Error al buscar lector';
      }
    })
  }

  buscarLibroAsincrono(){
    if(this.busquedaLibroTexto.length < 2){
      this.librosSugeridos = [];
      return;
    }

    this.libroService.buscarPorNombre(this.busquedaLibroTexto).subscribe({
      next: (librosDb) => {
        if(Array.isArray(librosDb)){
          this.librosSugeridos = librosDb;
        }else {
          this.librosSugeridos = [librosDb];
        }
      },
      error: (err) => {
        this.librosSugeridos = [];
      }
    })
    
  }

  agregarLibro(libro: any){
    this.mensajeModal = '';

    if(libro.stock <= 0){
      this.mensajeModal = `El libro "${libro.titulo}" no tiene stock disponible`;
      this.librosSugeridos = [];
      this.busquedaLibroTexto = '';
      return;
    }

    const yaExiste = this.libroSeleccionado.find(l => l.id === libro.id);
    if(!yaExiste){
      this.libroSeleccionado.push(libro);
    }

    this.busquedaLibroTexto = '';
    this.librosSugeridos = [];
  }

  quitarLibro(idLibro: number){
    this.libroSeleccionado = this.libroSeleccionado.filter(l => l.id !== idLibro);
  }

  private alertService = inject(AlertService);

  guardarPrestamo() {
    
    if(this.nuevoIdLector === null || this.libroSeleccionado.length === 0 || this.diasPrestamo <= 0){
      this.alertService.warn('Por favor complete todos los campos');
      return;
    }

    const nuevoPrestamoDto = {
      usuarioId: this.nuevoIdLector,
      diasPrestamo: this.diasPrestamo,
      librosIds: this.libroSeleccionado.map(l => l.id)
    };

    this.prestamoService.crearPrestamo(nuevoPrestamoDto).subscribe({
      next: (response) => {
        //console.log('Exito', response)
        this.alertService.success('Prestamo registrado');
        this.cerrarModal();
        this.cargarTodos();
      }, 
      error: (err) => {
        this.alertService.error('Error al registrar prestamo');
      }
    });    
  }

  entregarLibro(id: number){
    this.alertService.confirm(
      '¿Confirmar Devolución?',
      'Los libros volverán a estar disponibles en stock'
    ).then((confirmado)=> {
      if(confirmado){
        this.prestamoService.entregar(id).subscribe({
          next: () => {
            this.alertService.success('Libro(s) devuelto(s) con éxito');
            this.buscarPrestamo();
          },
          error: (err) => {
            this.alertService.error("No se pudo completar la devolución");
            console.log('Detalle' + err);
          }
        })
      }
    });
  }
} 



 