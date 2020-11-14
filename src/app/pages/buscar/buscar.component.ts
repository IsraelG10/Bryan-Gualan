import { DetalleDialogoComponent } from './detalle-dialogo/detalle-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Consulta } from './../../_model/consulta';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultaService } from './../../_service/consulta.service';
import { FiltroConsultaDTO } from './../../_dto/filtroConsultaDTO';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form : FormGroup
  maxFecha : Date = new Date()

  displayColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones']
  dataSource : MatTableDataSource<Consulta>

  @ViewChild(MatPaginator, {static:true}) paginator : MatPaginator
  @ViewChild(MatSort, {static:true}) sort: MatSort

  constructor(
    private consultaService : ConsultaService,
    private dialogo: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'cedula' : new FormControl(''),
      'nombreCompleto' : new FormControl(''),
      'fechaConsulta' : new FormControl('')
    })
  }

  buscar(){
    let filtro = new FiltroConsultaDTO(this.form.value['cedula'], this.form.value['nombreCompleto'].toLowerCase(), this.form.value['fechaConsulta'])
    /*this.consultaService.buscar(filtro).subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })*/
    if (filtro.fechaConsulta) {
      delete filtro.cedula
      delete filtro.nombreCompleto

      this.consultaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      })
    }else{
      delete filtro.fechaConsulta
      if (filtro.cedula.length === 0) {
        delete filtro.cedula
      }
      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto
      }
      this.consultaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      })
    }
  }

  verDetalle(consulta : Consulta){
    this.dialogo.open(DetalleDialogoComponent, {
      data: consulta
    })
  }

}
