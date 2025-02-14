import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  nombreUsuario: string | null = null;

  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.obtenerNombreUsuario();
  }


  //Método para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //Método para obtener el nombre del usuario autenticado y aparezca en el header
  obtenerNombreUsuario():void {
    const token = localStorage.getItem('token'); // Obtener el token directamente del localStorage
    if(token){
      this.authService.getNombreByUser(token).subscribe({
        next: (response) => {
          console.log('Nombre del usuario:', response);
          this.nombreUsuario = response.nombre_usuario;
        },
        error: (error) => {
          console.error('Error al obtener el nombre del usuario', error);
        }
      });
    } else {
      console.warn('No se encontro el token');
    }
  }

}
