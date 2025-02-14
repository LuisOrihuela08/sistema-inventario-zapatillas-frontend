import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   constructor(private http: HttpClient) { }

    // Método para registrar un usuario
  register(usuario: Usuario): Observable<any> {
    return this.http.post('http://localhost:8080/api-usuario/add/usuario', usuario);
  }

  //Método para loguear al usuario (Obtener el token)
  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post('http://localhost:8080/api-usuario/token', credentials, { responseType: 'text' }).pipe(
      tap(token => {

        localStorage.setItem('token', token)
      })
    )
  }

  validateToken(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable(observer => observer.error('No token found'));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`http://localhost:8080/api-usuario/validate`, { headers });
  }

  //Método para determinar si el usuario esta en sesion
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //Método para cerrar sesión
  logout() {
    localStorage.removeItem('token')
  }
  //Método para listar a los usuarios con paginacion
  listUsuariosPaginacion(token:string, page:number, size:number):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString());
    return this.http.get('http://localhost:8080/api-usuario/list-usuarios-paginados', {headers, params});
  }

  /*
  // Método para obtener la lista de usuarios - ROLE_ADMIN
  listUsuario(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-usuario/list/usuario', { headers });
  }
    */

  //Método para traer la informacion (perfil) de un usuario
  getUsuarioPerfil(token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-usuario/usuario-perfil', {headers});
  }

  //Este método es para editar el perfil del usuario
  updatePerfilUsuario(token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.put('http://localhost:8080/api-usuario/update-usuario-perfil', {headers});
  }

  //Método para obtener el nombre del usuario logeado y authenticado
  getNombreByUser(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<{ nombre_usuario: string }>('http://localhost:8080/api-usuario/nombre-usuario', { headers });

  }

  //Métod para buscar un usuario por su nombre - ROLE_ADMIN
  findUsuarioByNombre(token:string, nombre:string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get('http://localhost:8080/api-usuario/find/usuario-nombre-admin/' + nombre, {headers});
  }

  //Método para eliminar usuario, esto es solo para el usuario con ROLE_ADMIN
  deleteUsuario(token:string, id:number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete('http://localhost:8080/api-usuario/delete/usuario/'+ id, {headers});//responseType: 'text' -> responseType de tipo text es porque el backend devuelve un mensaje plano como respuesta a la hora de eliminar un usuario
  }

  //Para desencriptar el token que se manda el backend y poder desencriptarlo para obtener los roles del usuario, tuve que instalar esto:
  //npm install jwt-decode
  //Método obtener el token desde el localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //Método para decodificar el token
  getTokenDecoded(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  //Método para obtener el rol del usuario desde el token, en este caso que la de ROLE_ADMIN, esto para poder manejar las vistas que solo tendran el usuario con el rol de ROLE_ADMIN
   // Método para verificar si el usuario tiene un rol específico
   hasRole(roleName: string): boolean {
    const decodedToken = this.getTokenDecoded();
    if (decodedToken && decodedToken.roles) {
      return decodedToken.roles.some((role: any) => role.name === roleName);
    }
    return false;
  }
  // Método para verificar si el usuario es ADMIN
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

}

