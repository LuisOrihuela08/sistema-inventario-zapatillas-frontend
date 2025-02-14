import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../shared/services/inventario-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  cantidadInventario: number | null = null;
  marcaSiluetaZapatilla: string | null = null;
  montoTotal: number | null = null;
  marcaMasComprada: string | null = null;
  totalMarcaComprado: number | null = null;

  constructor(private inventarioService: InventarioService){}

  ngOnInit(): void {
    this.obtenerCantidadInventario();
    this.obtenerMarcaSiluetaZapatillaInventario();
    this.obtenerMontoTotalZapatillasInventario();
    this.obtenerMarcaZapatillaMasComprada();
  }

  //Método para traer la cantidad inventarios que tiene registrado un usuario
  obtenerCantidadInventario():void {
    const token = localStorage.getItem('token'); // Obtenemos el token para hacer la petición
    
    if(token){
      this.inventarioService.getCantidadInventario(token).subscribe({
        next: (response) => {
          console.log('Cantidad de inventario: ', response);
          this.cantidadInventario = response.cantidad_inventario;
        },
        error: (error) => {
          console.error('Error al obtener la cantidad de inventarios', error);
        }
      });
    } else {
      console.warn('No se encontro el token');
    }
  }

  //Método para obtener la marca y silueta de la ultima zapatilla registrada en el inventario
  obtenerMarcaSiluetaZapatillaInventario():void{
    const token = localStorage.getItem('token');
    
    if(token){
      this.inventarioService.getMarcaSiluetaZapatillaToInventario(token).subscribe({
        next: (response) => {
          console.log('La ultima zapatilla registada (marca y silueta): ', response);
          this.marcaSiluetaZapatilla = response.marca_silueta;
        },
        error: (error) => {
          console.error('Error al obtener la marca y silueta de la zapatilla', error);
        }
      });
    } else {
      console.warn('No se encontro el token');
    }
  }

  //Método para obtener el monto total gastado en zapatillas registrados en el inventario por usuario
  obtenerMontoTotalZapatillasInventario(): void {
    const token = localStorage.getItem('token');
    if(token){
      this.inventarioService.getMontoTotalGastadoZapatilla(token).subscribe({
        next: (response) => {
          console.log('El monto total gastado en zapatillas: ', response);
          this.montoTotal = response.monto_total;
        },
        error: (error) => {
          console.error('Error al obtener el monto total gastado', error);
        }
      });
    } else {
      console.warn('No se encontro el token');
    }
  }

  //Método para obtener la marca de la zapatilla mas comprada por el usuario
  obtenerMarcaZapatillaMasComprada(): void {
    const token = localStorage.getItem('token');
    if(token){
      this.inventarioService.getMarcaMasComprada(token).subscribe({
        next: (response) => {
          console.log('La marca mas comprado: ', response);
          this.marcaMasComprada = response.Marca;
          this.totalMarcaComprado = response.Cantidad;
        },
        error: (error) => {
          console.error('Error al obtener la marca mas comprada y la cantidad', error);
        }
      });
    } else {
      console.warn('No se encontro el token');
    }
  }

}
