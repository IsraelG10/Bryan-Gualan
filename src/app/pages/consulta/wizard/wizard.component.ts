import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../../_model/consulta';
import { ConsultaService } from './../../../_service/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../../_service/examen.service';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { MedicoService } from './../../../_service/medico.service';
import { PacienteService } from './../../../_service/paciente.service';
import { Examen } from './../../../_model/examen';
import { Especialidad } from './../../../_model/especialidad';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { Medico } from './../../../_model/medico';
import { Paciente } from './../../../_model/paciente';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  islinear = false

  firstFormGroup : FormGroup
  secondFormGroup : FormGroup

  pacientes : Paciente[]
  medicos : Medico[]
  detalleConsulta : DetalleConsulta[] = []
  especialidades : Especialidad[]
  examenesSeleccionados : Examen[] = []
  examenes : Examen[] = []

  diagnostico : string
  tratamiento : string
  mensaje : string
  pisos : number[] = []
  pisoSeleccionado : number = 0

  maxFecha : Date = new Date()
  fechaSeleccionada : Date = new Date()

  medicoSeleccionado : Medico
  pacienteSeleccionado : Paciente
  especialidadSeleccionada : Especialidad
  examenSeleccionado : Examen

  @ViewChild('stepper', {static: true}) stepper : MatStepper

  constructor(
    private formBuilder : FormBuilder,
    private pacienteService : PacienteService,
    private medicoService : MedicoService,
    private especialidadService : EspecialidadService,
    private examenService : ExamenService,
    private snackBar : MatSnackBar,
    private consultaService : ConsultaService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      'pacienteSeleccionado' : new FormControl(),
      'fecha' : new FormControl(new Date()),
      'diagnostico' : new FormControl(''),
      'tratamiento' : new FormControl('')
    })

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    })

    this.listarPacientes()
    this.listarMedicos()
    this.listarEspecialidades()
    this.listarExamenes()
    this.listarPisos()
  }

  seleccionarPiso(p : number){
    this.pisoSeleccionado = p
  }

  listarPisos(){
    for (let i = 1; i <= 20; i++) {
      this.pisos.push(i)
    }
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null ||
      this.medicoSeleccionado === null || this.pacienteSeleccionado === null)
  }

  registrar(){
    let consulta = new Consulta()
    consulta.especialidad = this.especialidadSeleccionada
    consulta.medico = this.medicoSeleccionado
    consulta.paciente = this.pacienteSeleccionado
    consulta.numPiso = this.pisoSeleccionado.toString()

    /*let tzoffset = (this.fechaSeleccionada).getTimezoneOffset()*60000
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString()

    consulta.fecha = localISOTime*/

    consulta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss')

    consulta.detalleConsulta = this.detalleConsulta

    let consultaListaExamenDTO = new ConsultaListaExamenDTO()
    consultaListaExamenDTO.consulta = consulta
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados


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
    this.pacienteSeleccionado = null
    this.especialidadSeleccionada = null
    this.medicoSeleccionado = null
    this.examenSeleccionado = null
    this.fechaSeleccionada = new Date()
    this.fechaSeleccionada.setHours(0)
    this.fechaSeleccionada.setMinutes(0)
    this.fechaSeleccionada.setSeconds(0)
    this.mensaje = ''
    this.pisoSeleccionado = 0
    this.stepper.reset()
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
    if (this.examenSeleccionado) {
      let cont = 0
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i]
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
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
          this.examenesSeleccionados.push(this.examenSeleccionado)
      }
    }else{
      this.mensaje = 'Debe de seleccionar un examen'
      this.snackBar.open(this.mensaje, 'Aviso', {
        duration : 3000
      })
    }
  }

  seleccionarMedico(medico : Medico){
    this.medicoSeleccionado = medico
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index, 1)
  }

  removerDiagnostico(index : number){
    this.detalleConsulta.splice(index, 1)
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

}
