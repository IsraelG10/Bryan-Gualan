import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../_service/examen.service';
import { Examen } from './../../_model/examen';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones']
  dataSource : MatTableDataSource<Examen>

  @ViewChild(MatSort, {static:true}) sort : MatSort
  @ViewChild(MatPaginator, {static:true}) paginator : MatPaginator

  constructor(private examenService: ExamenService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.examenService.examenCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
    this.examenService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
    this.examenService.mensajecambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration : 3000
      })
    })
  }

  filtrar(e : any){
    const filterValue = (e.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
