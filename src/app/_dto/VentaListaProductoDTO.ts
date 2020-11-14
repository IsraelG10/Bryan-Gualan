import { Producto } from '../_model/productos';
import { Ventas } from '../_model/ventas';
export class VentaListaProductoDTO{
  venta : Ventas
  lstProducto: Producto[]
  producto : Producto
}
