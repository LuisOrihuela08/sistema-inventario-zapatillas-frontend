import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service.service';
import { Usuario } from '../../shared/models/Usuario';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements OnInit {


  registerForm: FormGroup;

  constructor(private authService: AuthService,
    private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.required],//aca podria ser Validators.email
      fecha_nac: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    //Esto es para ir viendo los valores del formulario cada vez que cambian
    this.registerForm.valueChanges.subscribe(formData => {
      console.log('Datos del formulario cambiaron: ', formData);
    });

  }

  register() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: "warning",
        title: "Formulario incompleto",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonText: "Aceptar"
      });
      return;
    }
  
    const fechaNac = new Date(this.registerForm.value.fecha_nac);
    const fechaFormateada = fechaNac.toISOString().split('T')[0]; // Formato yyyy-MM-dd
  
    const usuario: Usuario = {
      id: 0, // el id se puede omitir ya que el backend no lo requiere
      nombre: this.registerForm.get('nombre')?.value,
      apellido: this.registerForm.get('apellido')?.value,
      correo: this.registerForm.get('correo')?.value,
      fecha_nac: fechaFormateada,
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value
    };
  
    console.log('Datos que se están enviando para registro: ', usuario);
  
    this.authService.register(usuario).subscribe({
      next: (response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario registrado exitosamente",
          showConfirmButton: false,
          timer: 1500
        });
        console.log('Usuario registrado exitosamente: ', response);
        this.registerForm.reset(); // Resetea el formulario
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.error?.message || "No se pudo registrar. Inténtalo nuevamente."
        });
        console.error("Error en el registro: ", error);
      }
    });
  }
  
}
