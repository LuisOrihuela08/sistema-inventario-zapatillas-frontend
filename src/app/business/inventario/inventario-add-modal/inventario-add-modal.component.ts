import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventarioService } from '../../../shared/services/inventario-service.service';
import { InventarioDTO } from '../../../shared/models/InventarioDTO';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/services/modal.service';
import { Estado } from '../../../shared/models/Estado';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-add-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './inventario-add-modal.component.html',
  styleUrl: './inventario-add-modal.component.css'
})
export class InventarioAddModalComponent implements OnInit {

  inventario: InventarioDTO = new InventarioDTO();
  estados: Estado[] = [];
  inventarioForm!: FormGroup;
  imagenFile: File | null = null;
  imagenUrl: string | ArrayBuffer | null = ''; // Para mostrar la imagen previa

  constructor(private inventarioService: InventarioService,
              private fb: FormBuilder,
              private modalService: ModalService) {
  }
  ngOnInit(): void {
    this.inventarioForm = this.fb.group({
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      comentario: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      marca: ['', Validators.required],
      silueta: ['', Validators.required],
      talla: ['', Validators.required],
      colorway: ['', Validators.required],
      materiales: ['', Validators.required],
      imagen: ['', Validators.required],
      colaboracion: ['', Validators.required],
      estado_id: ['', Validators.required],
      nombreEstado: [null]  // Nombre del estado para mostrar
    });
    
    console.log(this.inventarioForm.value); // Verifica si los valores están llegando
    this.inventarioForm.valueChanges.subscribe((valores) => {
      console.log('Valores actuales del formulario:', valores);
    });

    this.getAllEstados();
    
  }


  cerrarModal() {
    this.modalService.$modalAgregarInventario.emit(false)
  }

 

  //Este evento es para ver la imagen seleccionada
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement; //HTMLInputElement es para Typescript reconozca este elemento como input
    if (input.files && input.files.length) { //el primero lista los archivos y la segunda verifica que al menos un archivo haya sido seleccionado
      const file = input.files[0]; // trae la primera imagen
      const reader = new FileReader(); // esto permite leer archivos como imagenes y convertirlo a datos  utilizables en la web

      reader.onload = () => { //seejecuta cuando el archivo ha sido leido completamente
        this.imagenUrl = reader.result; // Mostrar la imagen seleccionada
      };

      reader.readAsDataURL(file);//lee el archivo y lo convierte en una URL en Base64.
    }
  }
  //Maneja la selección de una imagen en un formulario en Angular.
  //Método para manejar la selección de la imagen de manera correcta
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      this.inventarioForm.patchValue({
        imagen: file
      });
      this.inventarioForm.get('imagen')?.updateValueAndValidity();
      console.log('Imagen seleccionada:', this.imagenFile);
    } else {
      console.warn('No se seleccionó ninguna imagen');
    }
  }

  //Método para crear un inventario
  createInventario(): void {
    const token = localStorage.getItem('token');//Obtenemos el token para lograr hacer la peticion

    // Verificar si hay campos vacíos
    if (this.inventarioForm.invalid || !this.imagenFile) {
      console.log('Formulario inválido:', this.inventarioForm.invalid);
      console.log('Imagen seleccionada:', this.imagenFile);
      Swal.fire({
              icon: "warning",
              title: "Formulario incompleto",
              text: "Por favor, completa todos los campos antes de continuar.",
              confirmButtonText: "Aceptar"
            });
      return;
    }
    const fechaCompra = new Date(this.inventarioForm.value.fecha_compra);
    const fechaFormateada = fechaCompra.toLocaleDateString('en-GB'); // Formato dd/MM/yyyy

    const formData = new FormData();
    formData.append('cantidad', this.inventarioForm.value.cantidad);
    formData.append('precio', this.inventarioForm.value.precio);
    formData.append('comentario', this.inventarioForm.value.comentario);
    formData.append('fecha_compra', fechaFormateada);
    formData.append('marca', this.inventarioForm.value.marca);
    formData.append('silueta', this.inventarioForm.value.silueta);
    formData.append('talla', this.inventarioForm.value.talla);
    formData.append('colorway', this.inventarioForm.value.colorway);
    formData.append('materiales', this.inventarioForm.value.materiales);
    formData.append('imagen', this.imagenFile, this.imagenFile.name);
    formData.append('colaboracion', this.inventarioForm.value.colaboracion);
    formData.append('estado_id', this.inventarioForm.value.estado_id);

    console.log('Formulario enviado:', formData);

    if (token) {
      this.inventarioService.addInventario(token, formData).subscribe({
        next: (response) => {
          Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Inventario registrado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                  });
          setTimeout(() => {
            console.log('inventario registrado exitosamente: ', response);
            this.inventarioForm.reset();
            this.imagenFile = null;
          }, 500);

          //Y aca notifiamos que se ha agregado un inventario y que se actualice la lista del inventario
          this.inventarioService.notifyInventariosUpdated();
        },
        error: (err) => {
          console.log('Error al crear la publicación', err);
          Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.error?.message || "No se pudo registrar. Inténtalo nuevamente."
                  });
        }
      })
    } else {
      console.error('No se encontro el token');
    }
  }

  //Método para traer los estados para el formulario
  getAllEstados():void{
    const token = localStorage.getItem('token');
    if (token) {
      this.inventarioService.listAllEstados(token).subscribe({
        next: (data: Estado[]) => {
          this.estados = data;
          console.log('Estados cargados:', this.estados);
        },
        error: (err) => {
          console.error('Error al cargar los estados', err);
        }
      });
    } else {
      console.error('No se encontró el token');
    }
  }

  //Esto es para que en el input combo del estado, se vea los nombre y no los ids a la hora de asignarlos
  actualizarEstado(event: any) {
    const estadoSeleccionado = this.estados.find(e => e.nombreEstado === event.target.value);
    if (estadoSeleccionado) {
      this.inventarioForm.patchValue({
        estado_id: estadoSeleccionado.estado_id,  // Enviar ID al backend
        estado_nombre: estadoSeleccionado.nombreEstado // Mostrar nombre en el input
      });
    }
  }
  
  
}
