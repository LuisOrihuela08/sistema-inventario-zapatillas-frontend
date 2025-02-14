import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService} from '../../shared/services/auth.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginForm: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder,
    private authService: AuthService) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    console.log('Form submitted');  // Verifica si esta línea se ejecuta
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Response from API:', response);  // Verifica lo que devuelve la API
          //alert('Inicio de sesión exitoso')
          this.router.navigate(['/dashboard']);//Redirigir a la página de dashboard
        },
        error => {
          alert('Usuario o contraseña incorrectos');
          console.log(error);
        }
      )
    }
  }

}
