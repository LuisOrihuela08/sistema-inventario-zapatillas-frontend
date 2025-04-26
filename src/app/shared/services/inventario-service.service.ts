import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventario } from '../models/Inventario';
import { BehaviorSubject, Observable } from 'rxjs';
import { Zapatilla } from '../models/Zapatillas';
import { isNull } from 'node:util';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private inventariosUpdatedSource = new BehaviorSubject<void>(undefined);  // Emite evento para actualizaciones
  inventariosUpdated$ = this.inventariosUpdatedSource.asObservable();  // Observable para suscribirse

  constructor(private http: HttpClient) { }

  // Método para notificar a los componentes interesados
  notifyInventariosUpdated() {
    this.inventariosUpdatedSource.next();
  }

  //Método para listar el Inventario - Rol_ADMIN y ROL_USER
  //Este método lista inventario por usuario
  listInventario(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/inventario-usuario', { headers });
  }
  //Este método es para listar el inventario paginado por usuario, y es la que se esta usando en el sistema
  listInventarioPageByUsuario(token: string, page: number, size: number, orden: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString())
                                   .set('orden', orden);
    return this.http.get('http://localhost:8080/api-inventario/inventario-usuario-page', { headers, params });
  }

  //Método para agregar un Inventario. Y aca enviamos un formData porque no es un JSON sino un form-data lo que espera el backend
  addInventario(token: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post('http://localhost:8080/api-inventario/add/inventario', formData, { headers });
  }

  //Método para editar un inventario
  updateInventario(token: string, inventario_id: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put('http://localhost:8080/api-inventario/update/inventario/' + inventario_id, formData, { headers });

  }

  //Método para eliminar un inventario
  deleteInventario(token: string, inventario_id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return this.http.delete('http://localhost:8080/api-inventario/delete/inventario/' + inventario_id, { headers, responseType: 'text' });
  }

  //Método para listar zapatillas - ROLE_ADMIN
  listZapatilla(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/list-all/zapatillas', { headers });
  }
  //Ete método es para listar todas las zapatillas pero con paginacion
  listZapatillasPaginado(token: string, page: number, size: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const params = new HttpParams().set('page', page.toString())
      .set('size', size.toString());
    return this.http.get('http://localhost:8080/api-inventario/list/zapatillas', { headers, params });
  }

  //Este método es para buscar zapatillas por la marca, de uso solo para el usuario con el ROLE_ADMIN
  getZapatillasByMarca(token: string, marca: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/find/zapatilla-marca-admin/' + marca, { headers });
  }

  //Este método es para listar todos los estados sin paginación
  listAllEstados(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/list-all/estado', { headers });
  }

  //Método para buscar inventario por marca de la zapatilla
  searchInventarioByMarca(token: string, marca: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/find/marca-zapatilla/' + marca, { headers });
  }

  //Método para filtrar inventarios entre fechas
  getInventarioByFechaBetween(token: string, fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const params = new HttpParams().set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get('http://localhost:8080/api-inventario/find/fecha/rango', { headers, params });
  }

  //Método para ordenar el inventario por precio de menor a mayor o viceversa
  orderInventarioByPrecio(token: string, orden: string, page: number, size: number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const params = new HttpParams().set('orden', orden)
                                   .set('page', page.toString())
                                   .set('size', size.toString());
    return this.http.get('http://localhost:8080/api-inventario/find/precio/orden', { headers, params });
  }

  //Método para buscar inventario por fecha de compra (año)
  //Este método no se esta usando, ya que en el sistema estoy usando el filtro entre fechas
  getInventarioByFechaCompra(token: string, anio: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/find/fecha/' + anio, { headers });
  }

  //Método para obtener la cantidad de inventario que tiene un usuario
  getCantidadInventario(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/cantidad-inventario-usuario', { headers });
  }

  //Método para obtener la marca y silueta de la útlima zapatilla registrado en el inventario por usuario
  getMarcaSiluetaZapatillaToInventario(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/marca-silueta-zapatilla-inventario', { headers });
  }

  //Método para obtener el monto total gastado en zapatillas
  getMontoTotalGastadoZapatilla(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/obtener-monto-total-gastado', { headers });
  }

  //Método para obtener la marca de la zapatilla mas comprada por el usuario
  getMarcaMasComprada(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-inventario/marca-cantidad-zapatilla-mayor-comprada', { headers });
  }
}
