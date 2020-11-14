import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Producto } from 'src/app/_model/productos';
import { ProductosService } from 'src/app/_service/productos.service';
import { ProductosComponent } from '../productos.component';

@Component({
  selector: 'app-productos-edit',
  templateUrl: './productos-edit.component.html',
  styleUrls: ['./productos-edit.component.css']
})
export class ProductosEditComponent implements OnInit {

  producto : Producto

  constructor(
    private dialogoRef : MatDialogRef<ProductosEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Producto,
    private productosService : ProductosService
  ) { }

  ngOnInit(): void {
    this.producto = new Producto()
    this.producto.idProducto = this.data.idProducto
    this.producto.nombre = this.data.nombre
    this.producto.cantidad = this.data.cantidad
    this.producto.precio = this.data.precio

  }

  cancelar(){
    this.dialogoRef.close()
  }

  operar(){
    if(this.producto != null && this.producto.idProducto > 0) {
      //MODIFICAR
      //PRACTICA COMUN
      this.productosService.modificar(this.producto).subscribe( () =>{
        this.productosService.listar().subscribe(data => {
          this.productosService.productoCambio.next(data)
          this.productosService.mensajecambio.next('Producto Modificado')
        })
      })
    } else {
      //REGISTRAR
      this.productosService.registrar(this.producto).subscribe(() => {
        this.productosService.listar().subscribe(data =>{
          this.productosService.productoCambio.next(data)
          this.productosService.mensajecambio.next('Producto Registrado')
        })
      })
    }
    this.dialogoRef.close()
  }

}
