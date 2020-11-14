import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { ConsultaService } from './../../../_service/consulta.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta } from './../../../_model/consulta';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-dialogo',
  templateUrl: './detalle-dialogo.component.html',
  styleUrls: ['./detalle-dialogo.component.css']
})
export class DetalleDialogoComponent implements OnInit {

  consulta : Consulta
  examenes : ConsultaListaExamenDTO[] = []

  constructor(
    private dialogRef : MatDialogRef<DetalleDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data : Consulta,
    private consultaService : ConsultaService
  ) { }

  ngOnInit(): void {
    this.consulta = this.data
    this.listarExamenes()
  }

  listarExamenes(){
    this.consultaService.listarExamenesPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data
    })
  }

  cancelar(){
    this.dialogRef.close()
  }

}
