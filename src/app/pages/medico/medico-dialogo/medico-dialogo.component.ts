import { MedicoService } from './../../../_service/medico.service';
import { Medico } from './../../../_model/medico';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico : Medico

  constructor(
    private dialogoRef : MatDialogRef<MedicoDialogoComponent>,
    @Inject (MAT_DIALOG_DATA) private data : Medico,
    private medicoService : MedicoService
  ) { }

  ngOnInit(): void {
    this.medico = new Medico()
    this.medico.idPersona = this.data.idPersona
    this.medico.nombres = this.data.nombres
    this.medico.apellidos = this.data.apellidos
    this.medico.consultorio = this.data.consultorio
    this.medico.direccion = this.data.direccion
    this.medico.edad = this.data.edad
    this.medico.email = this.data.email
    this.medico.sexo = this.data.sexo
    this.medico.telefono = this.data.telefono
    this.medico.tipoSangre = this.data.tipoSangre
    this.medico.fotoUrl = this.data.fotoUrl
    this.medico.cedula = this.data.cedula
    console.log(this.medico)
  }

  cancelar(){
    this.dialogoRef.close()
  }

  operar(){
    if(this.medico != null && this.medico.idPersona > 0) {
      //MODIFICAR
      //PRACTICA COMUN
      /*this.medicoService.modificar(this.medico).subscribe( () =>{
        this.medicoService.listar().subscribe(data =>{
          this.medicoService.medicoCambio.next(data)
          this.medicoService.mensajecambio.next('Medico Modificado')
        })
      })*/
      //BUNEA PRACTICA
      this.medicoService.modificar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar()
      })).subscribe(data => {
        this.medicoService.medicoCambio.next(data)
        this.medicoService.mensajecambio.next('Medico Actualizado')
      })
    }else{
      //REGISTRAR
      this.medicoService.registrar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe(data =>{
          this.medicoService.medicoCambio.next(data)
          this.medicoService.mensajecambio.next('Medico Registrado')
        })
      })
    }
    this.dialogoRef.close()
  }

}
