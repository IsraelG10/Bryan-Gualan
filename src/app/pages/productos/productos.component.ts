import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../../_model/productos';
import { ProductosService } from '../../_service/productos.service';
import { ProductosEditComponent } from './productos-edit/productos-edit.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  dataSource : MatTableDataSource<Producto>;
  displayedColumns = ['idProduto', 'nombre', 'cantidad', 'acciones']
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private productoService : ProductosService,
    private snack : MatSnackBar,
    public dialogo : MatDialog
    ) { }

  ngOnInit(): void {
    this.productoService.productoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.productoService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialogo(producto? : Producto){
    let sig = producto != null ? producto : new Producto()
    this.dialogo.open(ProductosEditComponent, {
      data: sig
    })
  }


  eliminar(idProducto : number){
    this.productoService.eliminar(idProducto).subscribe(() =>{
      this.productoService.listar().subscribe(data =>{
        this.productoService.productoCambio.next(data)
        this.productoService.mensajecambio.next('Producto Eliminado')
      })
    })
  }

}
