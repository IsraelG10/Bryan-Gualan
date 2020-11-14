import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';
import { map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-edit',
  templateUrl: './signos-edit.component.html',
  styleUrls: ['./signos-edit.component.css']
})
export class SignosEditComponent implements OnInit {

  form : FormGroup
  pacientes : Paciente[];
  signo: Signos;
  edicion : boolean
  id : number
  pacienteSeleccionado : Paciente

  myControlPaciente: FormControl = new FormControl()

  pacientesFiltrados: Observable<any[]>

  maxFecha : Date = new Date()
  fechaSeleccionada : Date = new Date()
  constructor(
    private pacienteService : PacienteService,
    private signosService: SignosService,
    private dialogoRef : MatDialogRef<SignosEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Signos,
    private router: Router,
    private route : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.signo = new Signos()
    this.signo.idSignos= this.data.idSignos
    this.signo.paciente = this.data.paciente
    this.signo.temperatura = this.data.temperatura
    this.signo.ritmo = this.data.ritmo;

    console.log(this.signo);

    this.form = new FormGroup({
      'idSigno' : new FormControl(0),
      'paciente' : this.myControlPaciente,
      'fecha' : new FormControl(new Date),
      'ritmo' : new FormControl(''),
      'temperatura' : new FormControl(''),
    })
    this.listarPacientes();
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val =>
      this.filtrarPaciente(val)))

      this.route.params.subscribe((params : Params)=>{
        this.id = params['id']
        this.edicion = params['id'] != null
      })
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
  listarPacientes(){
    this.pacienteService.listar().subscribe( data =>{
      this.pacientes = data
    })
  }
  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val
  }

  seleccionarPaciente(e : any){
    this.pacienteSeleccionado = e.option.value
  }


  aceptar(){
    let signos = new Signos();
    signos.idSignos = this.form.value['id']
    signos.paciente = this.form.value['paciente']
    signos.ritmo = this.form.value['ritmo']
    signos.temperatura = this.form.value['temperatura']
    signos.fecha = moment().format('YYYY-MM-DDTHH:mm:ss')

    if(this.signo != null && this.signo.idSignos > 0) {
          this.signosService.modificar(this.signo).subscribe( () =>{
          this.signosService.listar().subscribe(data =>{
          this.signosService.pacienteCambio.next(data)
          this.signosService.mensajecambio.next('Medico Modificado')
        })
      })
    } else {
      this.signosService.registrar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data =>{
          this.signosService.pacienteCambio.next(data)
          this.signosService.mensajecambio.next('Ritmo Registrado con exito')
        })
      })
      this.dialogoRef.close();
    }

  }
}
