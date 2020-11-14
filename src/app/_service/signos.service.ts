import { Injectable } from '@angular/core';
import { Signos } from '../_model/signos';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosService {

  pacienteCambio = new Subject<Signos[]>()
  mensajecambio = new Subject<string>()

  url : string = `${environment.HOST}/signos`

  constructor(private http : HttpClient) {}

  listar(){
    return this.http.get<Signos[]>(this.url)
  }

  listarPorId(idSignos : number){
    return this.http.get<Signos>(`${this.url}/${idSignos}`)
  }

  registrar(signos : Signos){
    return this.http.post(this.url, signos)
  }

  modificar(signos : Signos){
    return this.http.put(this.url, signos)
  }

  eliminar(idSignos : number){
    return this.http.delete(`${this.url}/${idSignos}`)
  }

}
