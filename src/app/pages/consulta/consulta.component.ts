import { ConsultaService } from './../../_service/consulta.service';
import { ConsultaListaExamenDTO } from './../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../_model/consulta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../_service/examen.service';
import { Examen } from './../../_model/examen';
import { EspecialidadService } from './../../_service/especialidad.service';
import { Especialidad } from './../../_model/especialidad';
import { DetalleConsulta } from './../../_model/detalleConsulta';
import { MedicoService } from './../../_service/medico.service';
import { Medico } from './../../_model/medico';
import { PacienteService } from './../../_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes : Paciente[]
  medicos : Medico[]
  detalleConsulta : DetalleConsulta[] = []
  especialidades : Especialidad[]
  examenes : Examen[] = []
  examenesSeleccionados : Examen[] = []

  idPacienteSeleccionado : number
  idMedicoSeleccionado : number
  idExamenSeleccionado : number
  idEspecialidadSeleccionado : number

  maxFecha : Date = new Date()
  fechaSeleccionada : Date = new Date()

  diagnostico : string
  tratamiento : string
  mensaje : string

  constructor(
    private pacienteService : PacienteService,
    private medicoService : MedicoService,
    private especialidadService : EspecialidadService,
    private examenService : ExamenService,
    private snackBar : MatSnackBar,
    private consultaService : ConsultaService
  ) { }

  ngOnInit(): void {
    this.listarPacientes()
    this.listarMedicos()
    this.listarEspecialidades()
    this.listarExamenes()
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data =>{
      this.pacientes = data
    })
  }

  listarMedicos(){
    this.medicoService.listar().subscribe(data =>{
      this.medicos = data
    })
  }

  listarEspecialidades(){
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data
    })
  }

  listarExamenes(){
    this.examenService.listar().subscribe(data => {
      this.examenes = data
    })
  }

  agregar(){
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta()
      det.diagnostico = this.diagnostico
      det.tratamiento = this.tratamiento
      this.detalleConsulta.push(det)

      this.diagnostico = null
      this.tratamiento = null
    }
  }

  agregarExamen(){
    if (this.idExamenSeleccionado > 0) {
      let cont = 0
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i]
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++
          break
        }
      }
      if (cont > 0) {
        this.mensaje = 'El examen ya se encuentra en la lista'
        this.snackBar.open(this.mensaje, 'Aviso', {
          duration : 3000
        })
      }else{
        let examen = new Examen()
        examen.idExamen = this.idExamenSeleccionado
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
          examen.nombre = data.nombre
          examen.descripcion = data.descripcion
          this.examenesSeleccionados.push(examen)
        })
      }
    }else{
      this.mensaje = 'Debe de seleccionar un examen'
      this.snackBar.open(this.mensaje, 'Aviso', {
        duration : 3000
      })
    }
  }

  removerDiagnostico(index : number){
    this.detalleConsulta.splice(index, 1)
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index, 1)
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 || this.idPacienteSeleccionado === 0)
  }

  aceptar(){
    let medico = new Medico()
    medico.idPersona = this.idMedicoSeleccionado
    let especialidad = new Especialidad()
    especialidad.id = this.idEspecialidadSeleccionado
    let paciente = new Paciente()
    paciente.idPersona = this.idPacienteSeleccionado

    let consulta = new Consulta()
    consulta.especialidad = especialidad
    consulta.medico = medico
    consulta.paciente = paciente

    let tzoffset = (this.fechaSeleccionada).getTimezoneOffset()*60000
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString()

    consulta.fecha = localISOTime
    consulta.numPiso = "1"
    consulta.detalleConsulta = this.detalleConsulta

    let consultaListaExamenDTO = new ConsultaListaExamenDTO()
    consultaListaExamenDTO.consulta = consulta
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados
    console.log(consultaListaExamenDTO)
    this.consultaService.registrar(consultaListaExamenDTO).subscribe( () =>{
      this.snackBar.open("Se registro", "Aviso", {
        duration: 3000
      })

      setTimeout(() => {
        this.limpiarControles()
      }, 3000)
    })
  }

  limpiarControles(){
    this.detalleConsulta = []
    this.examenesSeleccionados = []
    this.diagnostico = ''
    this.tratamiento = ''
    this.idPacienteSeleccionado = 0
    this.idEspecialidadSeleccionado = 0
    this.idMedicoSeleccionado = 0
    this.idExamenSeleccionado = 0
    this.fechaSeleccionada = new Date()
    this.fechaSeleccionada.setHours(0)
    this.fechaSeleccionada.setMinutes(0)
    this.fechaSeleccionada.setSeconds(0)
    this.mensaje = ''
  }

}
