import { ConsultaService } from './../../../_service/consulta.service';
import { ConsultaListaExamenDTO } from './../../../_dto/consultaListaExamenDTO';
import { Consulta } from './../../../_model/consulta';
import { ExamenService } from './../../../_service/examen.service';
import { Examen } from './../../../_model/examen';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleConsulta } from './../../../_model/detalleConsulta';
import { MedicoService } from './../../../_service/medico.service';
import { Medico } from './../../../_model/medico';
import { Especialidad } from './../../../_model/especialidad';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { FormGroup, FormControl} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.css']
})
export class EspecialComponent implements OnInit {

  form : FormGroup

  detalleConsulta : DetalleConsulta[] = []

  pacientes : Paciente[] = []
  medicos : Medico[] = []
  especialidades : Especialidad[] = []
  examenes : Examen[] = []
  examenesSeleccionados : Examen[] = []


  diagnostico : string
  tratamiento : string
  mensaje : string

  pacienteSeleccionado : Paciente
  medicoSeleccionado: Medico
  especialidadSeleccionada : Especialidad
  examenSeleccionado : Examen

  myControlPaciente: FormControl = new FormControl()
  myControlMedico : FormControl = new FormControl()

  pacientesFiltrados: Observable<any[]>
  medicosFiltrados : Observable<any[]>

  maxFecha : Date = new Date()
  fechaSeleccionada : Date = new Date()

  constructor(
    private pacienteService : PacienteService,
    private especialidadService : EspecialidadService,
    private medicoService : MedicoService,
    private examenService : ExamenService,
    private snackBar : MatSnackBar,
    private consultaService : ConsultaService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'paciente' : this.myControlPaciente,
      'medico' : this.myControlMedico,
      'especialidad' : new FormControl,
      'fecha' : new FormControl(new Date),
      'tratamiento' : new FormControl(''),
      'diagnostico' : new FormControl('')
    })

    this.listarPacientes()
    this.listarEspecialidades()
    this.listarMedicos()
    this.listarExamenes()

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val =>
      this.filtrarPaciente(val)))

    this.medicosFiltrados = this.myControlMedico.valueChanges.pipe(map(val =>
      this.filtrarMedico(val)))
  }

  filtrarPaciente(val : any){
    if (val != null && val.idPersona > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
        || option.cedula.includes(val.cedula))
    }else{
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase())
        || option.cedula.includes(val))
    }
  }

  filtrarMedico(val : any){
    if (val != null && val.idPersona > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
        || option.cedula.includes(val.cedula))
    }else{
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase())
        || option.cedula.includes(val))
    }
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe( data =>{
      this.pacientes = data
    })
  }

  listarMedicos(){
    this.medicoService.listar().subscribe(data => {
      this.medicos = data
    })
  }

  listarEspecialidades(){
    this.especialidadService.listar().subscribe( data =>{
      this.especialidades = data
    })
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val
  }

  mostrarMedico(val : Medico){
    return val ? `${val.nombres} ${val.apellidos}` : val
  }

  seleccionarPaciente(e : any){
    this.pacienteSeleccionado = e.option.value
  }

  seleccionarMedico(e : any){
    this.medicoSeleccionado = e.option.value
  }

  agregar(){
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta()
      det.diagnostico = this.diagnostico
      det.tratamiento = this.tratamiento
      this.detalleConsulta.push(det)

      this.diagnostico = null
      this.tratamiento = null
    }else{
      this.mensaje = "Debe agregar un diagnóstico y tratamiento"
      this.snackBar.open(this.mensaje, "Aviso", {
        duration : 3000
      })
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

  removerDiagnostico(index : number){
    this.detalleConsulta.splice(index, 1)
  }

  removerExamen(index:number){
    this.examenesSeleccionados.splice(index, 1)
  }

  listarExamenes(){
    this.examenService.listar().subscribe(data => {
      this.examenes = data
    })
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null ||
      this.medicoSeleccionado === null || this.pacienteSeleccionado === null)
  }

  aceptar(){
    let consulta = new Consulta()
    consulta.especialidad = this.form.value['especialidad']
    //consulta.especialidad = this.especialidadSeleccionada
    consulta.medico = this.form.value['medico']
    consulta.paciente = this.form.value['paciente']
    consulta.numPiso = '1'

    let tzoffset = (this.fechaSeleccionada).getTimezoneOffset()*60000
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString()

    consulta.fecha = localISOTime
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
  }

}
