import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ventas } from '../../_model/ventas';
import { VentasService } from '../../_service/ventas.service';
import { VentasEditComponent } from './ventas-edit/ventas-edit.component';
import { VerdetalleComponent } from './verdetalle/verdetalle.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  dataSource : MatTableDataSource<Ventas>;
  displayedColumns = ['idVenta', 'paciente', 'acciones']
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private ventasService : VentasService,
    private snack : MatSnackBar,
    public dialogo : MatDialog
    ) { }

  ngOnInit(): void {
    this.ventasService.ventaCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.ventasService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialogo(venta? : Ventas){
    let sig = venta != null ? venta : new Ventas()
    this.dialogo.open(VentasEditComponent, {
      data: sig
    })
  }

  abrirDetalle(venta? : Ventas){
    let sig = venta != null ? venta : new Ventas()
    this.dialogo.open(VerdetalleComponent, {
      data: sig
    })
  }

  eliminar(idVenta : number){
    this.ventasService.eliminar(idVenta).subscribe(() =>{
      this.ventasService.listar().subscribe(data =>{
        this.ventasService.ventaCambio.next(data)
        this.ventasService.mensajecambio.next('Venta Eliminado')
      })
    })
  }

}
