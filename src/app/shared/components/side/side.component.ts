import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent implements OnInit{

  constructor(private authService: AuthService){}

  ngOnInit(): void {
 
  }

  //Este boleando permite verificar si el user logeado tiene el ROLE_ADMIN o no, y mostrara y/o oculatara las vistas
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

}
