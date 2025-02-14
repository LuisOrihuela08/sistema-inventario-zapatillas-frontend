import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service.service';
import { Usuario } from '../../shared/models/Usuario';
import { error } from 'node:console';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../shared/services/modal.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  usuarios: Usuario | null = null;//Esto trae la data desde el backend
  usuarioSeleccionado: Usuario | null = null;//Esto es para mandar los datos al componete para editar

  constructor(private authService: AuthService,
              private modalService: ModalService){}


  ngOnInit(): void {
    this.getUsuarioPerfil();
  }

   //Método para mostrar el perfil del usuario autenticado
  getUsuarioPerfil():void {
    const token = localStorage.getItem('token');//obtenemos el token para hacer la peticion
    if(token){
      this.authService.getUsuarioPerfil(token).subscribe(
        (data: any) => {
          this.usuarios = data.usuario;
          console.log(this.usuarios);
        },
        (error) => {
          console.error('Error al traer la información del usuario', error);
        }
      );
    } else {
      console.error('No se encontro el token');
    }
  }
}
