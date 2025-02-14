import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  $modalAgregarInventario = new EventEmitter<any>();
  $modalEditarInventario = new EventEmitter<any>();
  $modalEditarPerfil = new EventEmitter<any>();
}
