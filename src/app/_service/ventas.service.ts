import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { Ventas } from '../_model/ventas';
import { VentaListaProductoDTO } from '../_dto/VentaListaProductoDTO';
@Injectable({
  providedIn: 'root'
})
export class VentasService {

  ventaCambio = new Subject<Ventas[]>()
  mensajecambio = new Subject<string>()

  url : string = `${environment.HOST}/ventas`

  constructor(private http : HttpClient) {}

  listar(){
    return this.http.get<Ventas[]>(this.url)
  }

  listarPorId(idVenta : number){
    return this.http.get<Ventas>(`${this.url}/${idVenta}`)
  }

  registrar(ventaDTO : VentaListaProductoDTO){
    return this.http.post(this.url, ventaDTO)
  }

  modificar(venta : Ventas){
    return this.http.put(this.url, venta)
  }

  eliminar(idVenta : number){
    return this.http.delete(`${this.url}/${idVenta}`)
  }

  listarProductoPorVenta(idVenta : number){
    return this.http.get<VentaListaProductoDTO[]>(`${environment.HOST}/ventasproductos/${idVenta}`)
  }

}
