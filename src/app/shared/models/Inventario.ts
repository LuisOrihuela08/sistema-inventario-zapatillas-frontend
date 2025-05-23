import { Estado } from "./Estado";
import { Usuario } from "./Usuario";
import { Zapatilla } from "./Zapatillas";

export class Inventario{   
    id: number = 0;
    cantidad: number = 0;
    precio: number = 0;
    comentario: string = '';
    //fecha_compra: Date = new Date();
    fecha_compra: string = new Date().toISOString(); // Ahora es un string

    zapatilla: Zapatilla = new Zapatilla();
    usuario: Usuario = new Usuario();
    estado: Estado = new Estado();


}