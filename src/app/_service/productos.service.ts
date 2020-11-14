import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { Producto } from '../_model/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  productoCambio = new Subject<Producto[]>()
  mensajecambio = new Subject<string>()

  url : string = `${environment.HOST}/productos`

  constructor(private http : HttpClient) {}

  listar(){
    return this.http.get<Producto[]>(this.url)
  }

  listarPorId(idProducto : number){
    return this.http.get<Producto>(`${this.url}/${idProducto}`)
  }

  registrar(producto : Producto){
    return this.http.post(this.url, producto)
  }

  modificar(producto : Producto){
    return this.http.put(this.url, producto)
  }

  eliminar(idProducto : number){
    return this.http.delete(`${this.url}/${idProducto}`)
  }

}
