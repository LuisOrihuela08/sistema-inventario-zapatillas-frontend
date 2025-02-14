import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../shared/models/Usuario';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service.service';
import Swal from 'sweetalert2';
import { Rol } from '../../shared/models/Rol';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit  {

  usuarios: Usuario[] = [];
  roles: Rol [] = [];//Esto es para traer los roles del usuario
  currentPage: number = 0;
  pageSize: number = 13; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend
  nombreBuscado: string ='';//Esto es para permitir hacer la busqueda de un usuario por su nombre

  constructor(private authService: AuthService){}
  
  ngOnInit(): void {
    this.listAllUsuariosPaginados();
  }

  /*
   // Este método es para listar los usuarios
  listAllUsuarios(): void {
    
    const token = localStorage.getItem('token'); // Obtener el token directamente del localStorage
    if (token) {
      this.authService.listUsuario(token).subscribe(
        (data: Usuario[]) => {
          this.usuarios = data;
          console.log(this.usuarios);
        },
        (error) => {
          console.error('Error al cargar los usuarios', error);
        }
      );
    } else {
      console.error('No se encontró el token');
    }
  }
    */
  //Esto es para obtener los roles del usuario
  getRoles(usuario: Usuario): string {
    return usuario.rol ? usuario.rol.map(r => r.name).join(', ') : '';
  }
  

  //Método para listar a los usuarios con paginacion
  listAllUsuariosPaginados(): void{
    const token = localStorage.getItem('token');
    if(token){
      this.authService.listUsuariosPaginacion(token, this.currentPage, this.pageSize).subscribe(
        (data:any) => {
          this.usuarios = data.content;
          this.totalPages = data.totalPages;
          console.log('Usuarios cargados', this.usuarios);
        },
        (error) => {
          console.error('Error al cargar los usuarios', error);
        }
      );
    } else {
      console.error('No se encontro el token');
    }
  }

  nextPage(): void{
    if(this.currentPage < this.totalPages -1){
      this.currentPage++;
      this.listAllUsuariosPaginados();
    }
  }

  prevPage(): void{
    if(this.currentPage > 0){
      this.currentPage--;
      this.listAllUsuariosPaginados();
    }
  }

  //Método para eliminar un usuario
  deleteUsuario(id:number):void{
    const token = localStorage.getItem('token');
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
    
            if(token){
              this.authService.deleteUsuario(token, id).subscribe(
                () => {
                  //alert('Inventario eliminado con éxito');
                  Swal.fire({
                    title: "Eliminado!",
                    text: "El usuario fue eliminado.",
                    icon: "success"
                  });
                  console.log(`El usuario con ID ${id} eliminado correctamente`);
                  //this.listAllInventario();//Y una vez eliminado algun inventario refrescamos y nos mostrar el listado
                  // Filtrar el inventario eliminado y reasignar el array
                this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
                this.listAllUsuariosPaginados();
                },
                (error) => {
                  console.error('Error al eliminar el inventario', error);
                }
              )
            }
    
            
          }
        });
  }

  //Método para buscar un usuario por su nombre
  findUsuarioByNombre():void{
    const token = localStorage.getItem('token');
    if(token){
      if(!this.nombreBuscado.trim()){
        this.listAllUsuariosPaginados();
        return;
      }
      //En caso si se encuentra a un usuario por su nombre
      this.authService.findUsuarioByNombre(token, this.nombreBuscado).subscribe(
        (data: Usuario[]) => {
          this.usuarios = data;
          if(!data || length === 0){

          }
        },
        (error) => {
          console.error('Error al encontrar el usuario por su nombre', error);
          //Y con esto estamos limpiamos el buscador y nos muestra la lista de nuevo
          this.usuarios = [];
        }
      )
    }
  }
}
