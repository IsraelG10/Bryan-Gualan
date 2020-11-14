import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from './../../_service/especialidad.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Especialidad } from './../../_model/especialidad';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  displayedColumns = ['id', 'nombre','acciones']
  dataSource : MatTableDataSource<Especialidad>

  @ViewChild(MatSort, {static:true}) sort : MatSort
  @ViewChild(MatPaginator, {static:true}) paginator : MatPaginator

  constructor(
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar,
    public route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.especialidadService.especialidadCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
    this.especialidadService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
    this.especialidadService.mensajecambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration : 3000
      })
    })
  }

  filtrar(e : any){
    const filterValue = (e.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  eliminar(id : number){
    this.especialidadService.eliminar(id).subscribe(() =>{
      this.especialidadService.listar().subscribe(data =>{
        this.especialidadService.especialidadCambio.next(data)
        this.especialidadService.mensajecambio.next('Especialidad Eliminado')
      })
    })
  }
}
