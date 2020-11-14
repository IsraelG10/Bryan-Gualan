import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicoService } from './../../_service/medico.service';
import { Medico } from './../../_model/medico';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  dataSource : MatTableDataSource<Medico>;
  displayedColumns = ['idPersona', 'nombres', 'apellidos', 'acciones']
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private medicoService : MedicoService,
    private snack : MatSnackBar,
    public dialogo : MatDialog
    ) { }

  ngOnInit(): void {
    this.medicoService.medicoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.medicoService.mensajecambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration : 3000
      })
    })

    this.medicoService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialogo(medico? : Medico){
    let med = medico != null ? medico : new Medico()
    this.dialogo.open(MedicoDialogoComponent, {
      width: '500px',
      data: med
    })
  }

}
