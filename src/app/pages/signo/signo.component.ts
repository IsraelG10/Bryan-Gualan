import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from '../../_model/signos';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SignosService } from '../../_service/signos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SignosEditComponent } from './signos-edit/signos-edit.component';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  dataSource : MatTableDataSource<Signos>;
  displayedColumns = ['idSignos', 'temperatura', 'ritmo', 'acciones']
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private signosService : SignosService,
    private snack : MatSnackBar,
    public dialogo : MatDialog
    ) { }

  ngOnInit(): void {
    this.signosService.pacienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.signosService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialogo(signos? : Signos){
    let sig = signos != null ? signos : new Signos()
    this.dialogo.open(SignosEditComponent, {
      data: sig
    })
  }


  eliminar(idSignos : number){
    this.signosService.eliminar(idSignos).subscribe(() =>{
      this.signosService.listar().subscribe(data =>{
        this.signosService.pacienteCambio.next(data)
        this.signosService.mensajecambio.next('Paciente Eliminado')
      })
    })
  }

}
