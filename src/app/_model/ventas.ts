import { Paciente } from './paciente';
import { Producto } from './productos';
export class Ventas {
  idVenta : number;
  paciente : Paciente;
  producto : Producto;
  total : number;
  fecha : string

}
