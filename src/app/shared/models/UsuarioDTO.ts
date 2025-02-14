export class UsuarioDTO{
    id : number = 0;
    username: string = '';
    password: string = '';
    nombre: string = '';
    apellido: string = '';
    correo: string = '';
    fecha_nac: string = new Date().toISOString(); // Ahora es un string
    
}