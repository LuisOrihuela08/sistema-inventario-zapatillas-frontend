import { Rol } from "./Rol";

export class Usuario{
    id : number = 0;
    username: string = '';
    password: string = '';
    nombre: string = '';
    apellido: string = '';
    correo: string = '';
    fecha_nac: string = new Date().toISOString(); // Ahora es un string

    rol?: Rol[]; // <- Hacerlo opcional con `?`
    
}