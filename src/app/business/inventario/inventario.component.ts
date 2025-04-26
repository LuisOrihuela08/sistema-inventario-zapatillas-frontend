import { Component, OnDestroy, OnInit } from '@angular/core';
import { Inventario } from '../../shared/models/Inventario';
import { InventarioService } from '../../shared/services/inventario-service.service';
import { CommonModule } from '@angular/common';
import { Zapatilla } from '../../shared/models/Zapatillas';
import { FormsModule } from '@angular/forms';
import { InventarioAddModalComponent } from './inventario-add-modal/inventario-add-modal.component';
import { ModalService } from '../../shared/services/modal.service';
import { InventarioUpdateModalComponent } from './inventario-update-modal/inventario-update-modal.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, InventarioAddModalComponent, InventarioUpdateModalComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit, OnDestroy {

  inventarios: Inventario[] = [];
  zapatillas: Zapatilla[] = [];
  marcaBuscada: string = ''; //Esto me va a permitir hacer la busqueda de inventario por Marca de zapatilla
  anio: number = 0; //Esto me va a permitir hacer la busqueda de inventario por año de compra 
  fechaInicio: string = ''; //Esto me va a permitir hacer la busqueda de inventario entre fechas
  fechaFin: string = ''; //Esto me va a permitir hacer la busqueda de inventario entre fechas
  orden: string = ''; //Esto me va a permitir hacer la busqueda de inventario por orden de precio - desc por defecto
  ordenSeleccionado: string = ''; //Esto me va a permitir hacer la busqueda de inventario por orden de precio y estado activo
  isModalAgregarInventarioVisible: boolean = false; //Esto una variable para añadirle logica y podras el modal para agregar
  isModalEditarInventarioVisible: boolean = false; //Esto es una variable para que es parte de la logica para ver el modal de editar
  inventarioSeleccionado: Inventario | null = null;
  private inventariosSubscription: Subscription = undefined!;  //Esto es para utilizar la subscripcion del service y refrescar el inventario cada vez que agrega uno nuevo
  //Esto es para la paginacion:
  currentPage: number = 0;//Numero de pagina
  pageSize: number = 10; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend

  constructor(private inventarioService: InventarioService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.listAllInventarioPageByUsuario(this.orden);
    this.modalService.$modalAgregarInventario.subscribe((valor) => { this.isModalAgregarInventarioVisible = valor })
    this.modalService.$modalEditarInventario.subscribe((valor) => { this.isModalEditarInventarioVisible = valor })
    this.inventariosSubscription = this.inventarioService.inventariosUpdated$.subscribe(
      () => {
        this.listAllInventarioPageByUsuario(this.orden);//Esto refrescara la lista de inventarios
      }
    )
  }

  ngOnDestroy(): void {
    //Aca nos vamos a asegurar de desuscrirnos para evitar fugas de memoria
    if (this.inventariosSubscription) {
      this.inventariosSubscription.unsubscribe();
    }
  }



  mostrarModal() {
    this.modalService.$modalAgregarInventario.emit(true);
    console.log("Modal abierto:", this.isModalAgregarInventarioVisible); // Verifica que el modal se muestra
  }

  mostrarModalEditarInventario(inventario: Inventario) {
    this.inventarioSeleccionado = inventario;
    this.modalService.$modalEditarInventario.emit(true);
    console.log("Modal abierto:", this.isModalEditarInventarioVisible);// Para verificar en la consola que se abre
  }

  //Este método es para listar el inventario PAGINADO
  listAllInventarioPageByUsuario(ordenSeleccionado: string): void {
    const token = localStorage.getItem('token');

    // Actualizamos la variable `orden` con el valor seleccionado por el usuario
    this.orden = ordenSeleccionado;
    console.log('Orden seleccionado:', this.orden);  // Muestra en consola el orden seleccionado

    if (token) {
      this.inventarioService.listInventarioPageByUsuario(token, this.currentPage, this.pageSize, this.orden).subscribe(
        (data: any) => {
          this.inventarios = data.content;
          this.totalPages = data.totalPages;
          console.log('Inventarios cargados', this.inventarios);
        },
        (error) => {
          console.error('Hubo error al cargar los inventarios', error);
        }
      );
    } else {
      console.error('No se encontro el token');
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.listAllInventarioPageByUsuario(this.orden);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.listAllInventarioPageByUsuario(this.orden);
    }
  }


  //Este método es para listar el inventario por usuario
  listAllInventario(): void {
    const token = localStorage.getItem('token'); //Obtenemos el token para lograr hacer la peticion
    if (token) {
      this.inventarioService.listInventario(token).subscribe(
        (data: Inventario[]) => {
          this.inventarios = data;
          console.log(this.inventarios);
        },
        (error) => {
          console.error('Error al cargar el inventario', error);
        }
      );
    } else {
      console.error('No se encontro el token')
    }
  }

  //Este método es para eliminar un inventario
  eliminarInventario(inventarioId: number): void {
    const token = localStorage.getItem('token');//Obtenemos para lograr hacer la petición

    /*Esto es atraves de un alert
    if (!confirm('¿Estás seguro de que deseas eliminar este inventario?')) {
      return; // Si el usuario cancela, no hace nada
    }
      */
    Swal.fire({
      title: "Estas seguro de eliminarlo?",
      text: "No habra manera de revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {

        if (token) {
          this.inventarioService.deleteInventario(token, inventarioId).subscribe(
            () => {
              //alert('Inventario eliminado con éxito');
              Swal.fire({
                title: "Eliminado!",
                text: "El registro fue eliminado.",
                icon: "success"
              });
              console.log(`Inventario con ID ${inventarioId} eliminado correctamente`);
              //this.listAllInventario();//Y una vez eliminado algun inventario refrescamos y nos mostrar el listado
              // Filtrar el inventario eliminado y reasignar el array
              this.inventarios = this.inventarios.filter(inventario => inventario.id !== inventarioId);
            },
            (error) => {
              console.error('Error al eliminar el inventario', error);
            }
          )
        }


      }
    });


  }

  //Método para buscar un inventario por la marca de la zapatilla
  buscarPorMarca(): void {
    const token = localStorage.getItem('token'); //Obtenemos el token para lograr hacer la peticion   

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    if (!this.marcaBuscada.trim()) {
      //alert('Por favor, ingresa una marca para buscar.'); -> Esto lo estoy eliminando para que cuando le de x del input me lista el inventario
      this.listAllInventarioPageByUsuario(this.orden);
      return;
    }

    //En caso si se ingresa una Marca
    this.inventarioService.searchInventarioByMarca(token, this.marcaBuscada).subscribe(
      (data: Inventario[]) => {
        this.inventarios = data;
        if (!data || data.length === 0) {
          //alert('No se encontró el inventario'); -> Esto lo comente para que me aparezca solo el mensaje de parrafo de que no hay inventario
        }
      },
      (error) => {
        console.error('Error al buscar inventario', error);
        //alert('No se encuentro el inventario'); -> Esto lo comente para que me aparezca solo el mensaje de parrafo de que no hay inventario
        this.inventarios = []; // Asegurar que se limpie en caso de error
      }
    )
  }

  //Método para ordenar el inventario por precio
  //Este metodo no lo estoy utilizando, pero queda como ejemplo
  //Debido a que estoy utilizando el listado paginado por usuario y ahi mismo estoy ordenando por precio
  ordenarInventarioPorPrecio(ordenSeleccionado: string): void {
    const token = localStorage.getItem('token'); //Obtenemos el token para lograr hacer la peticion

    if (!token) {
      console.error('No se encontró el token');
      return;
    }
    // Actualizamos la variable `orden` con el valor seleccionado por el usuario
    this.orden = ordenSeleccionado;
    console.log('Orden seleccionado:', this.orden);  // Muestra en consola el orden seleccionado

    //En caso si se ingresa el orden
    this.inventarioService.orderInventarioByPrecio(token, this.orden, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.inventarios = data.content;
        this.totalPages = data.totalPages;
        console.log('Inventario ordenado por precio', this.inventarios);
      },
      (error) => {
        console.error('Error al ordenar el inventario por precio', error);
        this.inventarios = []; // Asegurar que se limpie en caso de error
      }
    )

  }

  //Método para buscar inventario entre fechas
  buscarInventarioEntreFechas(): void {
    const token = localStorage.getItem('token'); //Obtenemos el token para lograr hacer la peticion

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      this.listAllInventarioPageByUsuario(this.orden);
      return;
    }

    //En caso si se ingresa las fechas
    this.inventarioService.getInventarioByFechaBetween(token, this.fechaInicio, this.fechaFin).subscribe(
      (data: Inventario[]) => {
        this.inventarios = data;
      },
      (error) => {
        console.error('Error al buscar inventario entre fechas', error);
        this.inventarios = []; // Asegurar que se limpie en caso de error
      }
    )
  }



  //Este método no lo estoy usando en el sistema
  //Método para buscar inventario por fecha de compra (año)
  buscarPorFechaCompra(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    if (!this.anio) {
      this.listAllInventarioPageByUsuario(this.orden);
      return;
    }

    //En caso si se ingresa el año
    this.inventarioService.getInventarioByFechaCompra(token, this.anio).subscribe(
      (data: Inventario[]) => {
        this.inventarios = data;
      },
      (error) => {
        console.error('Error al buscar inventario por fecha de compra', error);
        this.inventarios = [];
      }
    )
  }

  //Esto es para limpiar los filtros para el inventario
  limpiarFiltros(): void{
    this.marcaBuscada = ''; //Limpia el input de busqueda por la marca
    this.fechaInicio = ''; //Limpia el input de busqueda por la fecha de inicio
    this.fechaFin = ''; //Limpia el input de busqueda por la fecha de fin
    this.orden = ''; //Limpia el input de busqueda por el orden de precio

    //Reinicia la paginación
    this.currentPage = 0;
    this.pageSize = 10;//Esto es la cantidad inicial de inventarios por pagina

    this.listAllInventarioPageByUsuario(this.orden);//El orden igual esta inicializado en vacio, entonces normal listara
  }
}
