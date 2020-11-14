import { ActivatedRoute } from '@angular/router';
import { PacienteService } from './../../_service/paciente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  cantidad : number = 0

  dataSource : MatTableDataSource<Paciente>;
  displayedColumns = ['idPersona', 'nombres', 'apellidos', 'acciones']
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private pacienteService : PacienteService,
    private snack : MatSnackBar,
    public route : ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.pacienteService.pacienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.pacienteService.mensajecambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration : 3000
      })
    })

    /*this.pacienteService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })*/

    this.pacienteService.listarPageable(0,10).subscribe(data =>{
      console.log(data)
      this.cantidad = data.totalElements
      this.dataSource = new MatTableDataSource(data.content)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(idPaciente : number){
    this.pacienteService.eliminar(idPaciente).subscribe(() =>{
      this.pacienteService.listar().subscribe(data =>{
        this.pacienteService.pacienteCambio.next(data)
        this.pacienteService.mensajecambio.next('Paciente Eliminado')
      })
    })
  }

  mostrarMas(e: any){
    //console.log(e)
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      //console.log(data)
      this.cantidad = data.totalElements
      this.dataSource = new MatTableDataSource(data.content)
      this.dataSource.sort = this.sort
      //this.dataSource.paginator = this.paginator
    })
  }

}
