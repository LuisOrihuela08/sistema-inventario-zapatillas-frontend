import { Estado } from "./Estado";

export class InventarioDTO{
    inventario_id: number = 0;
    cantidad: number = 0;
    precio: number = 0;
    comentario: string = '';
    fecha_compra: string = new Date().toISOString(); // Ahora es un string
    marca: string = '';
    silueta: string = '';
    talla: string = '';
    colorway: string = '';
    materiales: string = '';
    imagen: string = '';

    estado: Estado = new Estado();
}