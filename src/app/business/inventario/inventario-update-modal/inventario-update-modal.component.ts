import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { Inventario } from '../../../shared/models/Inventario';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventarioDTO } from '../../../shared/models/InventarioDTO';
import { InventarioService } from '../../../shared/services/inventario-service.service';
import { Estado } from '../../../shared/models/Estado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-update-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inventario-update-modal.component.html',
  styleUrl: './inventario-update-modal.component.css'
})
export class InventarioUpdateModalComponent implements OnInit {

  @Input() inventario!: Inventario; // <-- Recibir el inventario seleccionado
  inventarios: InventarioDTO = new InventarioDTO; //Este models es para permitir enviar los campos al backend
  estados: Estado[] = [];
  form!: FormGroup;
  imagenUrl: string | ArrayBuffer | null = ''; // Para mostrar la imagen previa
  imagenFile: File | null = null;


  constructor(private modalService: ModalService,
              private fb: FormBuilder,
              private inventarioService: InventarioService) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      inventario_id: [this.inventario?.id],
      marca: [this.inventario?.zapatilla?.marca || ''],
      silueta: [this.inventario?.zapatilla?.silueta || ''],
      colaboracion: [this.inventario?.zapatilla?.colaboracion || ''],
      talla: [this.inventario?.zapatilla?.talla || ''],
      colorway: [this.inventario?.zapatilla?.colorway || ''],
      materiales: [this.inventario?.zapatilla?.materiales || ''],
      cantidad: [this.inventario?.cantidad || ''],
      precio: [this.inventario?.precio || ''],
      fecha_compra: [this.inventario?.fecha_compra || ''],
      comentario: [this.inventario?.comentario || ''],
      imagen: [this.inventario?.zapatilla?.imagen || ''],
      estado_id: [this.inventario?.estado?.estado_id || ''],
      nombreEstado:[this.inventario?.estado?.nombreEstado || '']
    });
    // Si ya hay una imagen en el inventario, mostrarla
    this.imagenUrl = this.inventario?.zapatilla?.imagen || null;
    
    console.log(this.form.value); // Verifica si los valores están llegando
    this.form.valueChanges.subscribe((valores) => {
      console.log('Valores actuales del formulario:', valores);
    });

    this.getAllEstados();

  }

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
  /*Ejemplo practico de onFileChange()
    Si un usuario selecciona una imagen llamada foto.jpg, el flujo es:

    - Se detecta el archivo seleccionado.
    - Se crea un FileReader.
    - Se lee el archivo y se convierte en una URL Base64.
    - Se asigna la URL a this.imagenUrl, lo que permite mostrar la imagen en la página.
  */
 
  //Esto es solo si en caso se va a ir otra imagen al inventario seleccionado
  //Maneja la selección de una imagen en un formulario en Angular.
  //Método para manejar la selección de la imagen de manera correcta
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      this.form.patchValue({
        imagen: file
      });
      this.form.get('imagen')?.updateValueAndValidity();
      console.log('Imagen seleccionada:', this.imagenFile);
    } else {
      console.warn('No se seleccionó ninguna imagen');
    }
  }

  //Método para editar un inventario y si en caso se proporciona nuevos valores a algun campo
  editInventario(){
    const token = localStorage.getItem('token');//Obtenemos el token para hacer la peticion
    
    //Esta condicional es solo para visualizar en la consola la imagen seleccionada
    if(this.imagenFile){
      console.log('Imagen seleccionada:', this.imagenFile);
    } else {
      console.log('No se proporciono una nueva imagen, se mantiene la anterior')
    }

    const fechaCompra = new Date(this.form.value.fecha_compra);
    const fechaFormateada = fechaCompra.toLocaleDateString('eng-GB');// Formato dd/MM/yyyy

    const formData = new FormData();
    formData.append('inventario_id', this.form.value.inventario_id);
    formData.append('cantidad', this.form.value.cantidad);
    formData.append('precio', this.form.value.precio);
    formData.append('comentario', this.form.value.comentario);
    formData.append('fecha_compra', fechaFormateada);
    formData.append('marca', this.form.value.marca);
    formData.append('silueta', this.form.value.silueta);
    formData.append('talla', this.form.value.talla);
    formData.append('colorway', this.form.value.colorway);
    formData.append('materiales', this.form.value.materiales);
    formData.append('colaboracion', this.form.value.colaboracion);
    formData.append('estado_id', this.form.value.estado_id);
    
    //Esto es para agregar la imagen si se proporciona una nueva, porque recordar que el backend tambien acepta null
    //y conservara la imagen que ya tenia registrado en la base de datos
    if(this.imagenFile){
      //formData.append('imagen', this.imagenFile, this.imagenFile.name);
      formData.append('imagen', this.imagenFile);
    }
    console.log('Formulario enviado:', formData);

    if (token) {
      this.inventarioService.updateInventario(token, this.form.value.inventario_id, formData).subscribe({
        next: (response) => {
          Swal.fire({
                              position: "top-end",
                              icon: "success",
                              title: "Inventario actualizado exitosamente",
                              showConfirmButton: false,
                              timer: 1500
                            });
          //Y aca notifiamos que se ha agregado un inventario y que se actualice la lista del inventario
          console.log('inventario actualizado exitosamente: ', response);
          this.inventarioService.notifyInventariosUpdated();
        },
        error: (err) => {
          console.log('Error al actualizar el inventario', err);
          Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: err.error?.message || "No se pudo actualizar. Inténtalo nuevamente."
                            });
        }
      })
    } else {
      console.error('No se encontro el token');
    }

  }

  //Método para obtener los estados y mostrarlos en el formulario
  getAllEstados():void{
    const token = localStorage.getItem('token');
    if(token){
      this.inventarioService.listAllEstados(token).subscribe({
        next: (data: Estado[]) => {
          this.estados = data;
          console.log('Estados cargados', this.estados);
        },
        error: (err) => {
          console.error('Error al cargar los estados', err);
        }
      });
    } else {
      console.error('No se encontro el token');
    }
  }

  //Esto es para mostrar el nombre del estado, pero que al backend el id del estado selecionado pero no el nombre
  actualizarEstado(event:any){
    const estadoSeleccionado = this.estados.find(e => e.nombreEstado === event.target.value);
    if(estadoSeleccionado){
      this.form.patchValue({
        estado_id: estadoSeleccionado.estado_id,
        estado_nombre: estadoSeleccionado.nombreEstado
      });
    }
  }

  cerrarModalEditar() {
    this.modalService.$modalEditarInventario.emit(false);
  }
}
