import { Component, OnInit } from '@angular/core';
import { Zapatilla } from '../../shared/models/Zapatillas';
import { InventarioService } from '../../shared/services/inventario-service.service';
import { CommonModule } from '@angular/common';
import { error } from 'node:console';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zapatillas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zapatillas.component.html',
  styleUrl: './zapatillas.component.css'
})
export class ZapatillasComponent implements OnInit {

  zapatillas: Zapatilla[] = [];
  currentPage: number = 0;
  pageSize: number = 13; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend
  marcaBuscada: string='';//Esta variable va a permitir hacer la busqueda de zapatillas por marca

  constructor(private inventarioService: InventarioService){}

  ngOnInit(): void {
    //this.listAllZapatillas();// esto llama al metodo listar sin paginacion
    this.listAllZapatillasPaginado();//Esto esta llamado al metodo de listado con paginacion
  }

  //Método para listar todas las zapatillas de todos los usuarios - ROLE_ADMIN
  //Método sin paginacion
  /*
  listAllZapatillas(): void {

    const token = localStorage.getItem('token'); //Obtenemos el token para lograr hacer la peticion
    if(token){
      this.inventarioService.listZapatilla(token).subscribe(
        (data: Zapatilla[]) => {
          this.zapatillas = data;
          console.log(this.zapatillas);
        },
        (error) => {
          console.error('Error al cargar las zapatillas', error);
        }
      );
    } else {
      console.error('No se encontro el token')
    }
  }
    */
   listAllZapatillasPaginado(): void{
    const token = localStorage.getItem('token');

    if(token){
      this.inventarioService.listZapatillasPaginado(token, this.currentPage, this.pageSize).subscribe(
        (data:any) => {// El backend devuelve un Page<Zapatilla>, no solo un array
          this.zapatillas = data.content; //aca content contiene toda la lista
          this.totalPages = data.totalPages;//total de paginas segun el backend
          console.log('Zapatillas cargadas', this.zapatillas);
        },
        (error) => {
          console.error('Error al cargar las zapatillas', error);
        }
      );
    } else {
      console.error('No se encontro el token');
    }
   }

   nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.listAllZapatillasPaginado();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.listAllZapatillasPaginado();
    }
  }

  //Este método es para buscar zapatillas por marca
  getZapatillasByMarca(): void{
    const token = localStorage.getItem('token');//Obtenemos el token para lograr la peticion
    if(token){
      if(!this.marcaBuscada.trim()){
        this.listAllZapatillasPaginado();
        return;
      }

      //En caso si se encuentre la zapatillas por su marca
      this.inventarioService.getZapatillasByMarca(token, this.marcaBuscada).subscribe(
        (data: Zapatilla[]) =>{ 
          this.zapatillas = data;
          if(!data || data.length === 0){
            //Aca lo dejamos asi
          }
        },
        (error) => {
          console.error('Error al buscar una zapatilla', error);
          //Y con esto limpiamos el buscador y lista todo de nuevo
          this.zapatillas = [];
        }
      )
    }
  }

}
