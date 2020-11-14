import { Paciente } from './../../../_model/paciente';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/_service/paciente.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form : FormGroup
  id : number
  edicion : boolean

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private pacienteService : PacienteService
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'apellidos' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'nombres' : new FormControl('', Validators.required),
      'cedula' : new FormControl(''),
      'telefono' : new FormControl(''),
      'direccion' : new FormControl(''),
      'email' : new FormControl(''),
      'edad' : new FormControl(''),
      'sexo' : new FormControl(''),
      'tipoSangre' : new FormControl(''),
      'historiaClinica' : new FormControl(''),
      'enfermedades' : new FormControl('')
    })

    this.route.params.subscribe((params : Params)=>{
      this.id = params['id']
      this.edicion = params['id'] != null
      this.initForm()
    })
  }

  get f() { return this.form.controls}

  initForm(){
    if (this.edicion) {
      this.pacienteService.listarPorId(this.id).subscribe(data =>{
        this.form = new FormGroup({
          'id' : new FormControl(data.idPersona),
          'apellidos' : new FormControl(data.apellidos),
          'nombres' : new FormControl(data.nombres),
          'cedula' : new FormControl(data.cedula),
          'telefono' : new FormControl(data.telefono),
          'direccion' : new FormControl(data.direccion),
          'email' : new FormControl(data.email),
          'edad' : new FormControl(data.edad),
          'sexo' : new FormControl(data.sexo),
          'tipoSangre' : new FormControl(data.tipoSangre),
          'historiaClinica' : new FormControl(data.historiaClinica),
          'enfermedades' : new FormControl(data.enfermedades)
        })
      })
    }
  }

  operar(){
    let paciente = new Paciente
    paciente.idPersona = this.form.value['id']
    paciente.nombres = this.form.value['nombres']
    paciente.apellidos = this.form.value['apellidos']
    paciente.cedula = this.form.value['cedula']
    paciente.telefono = this.form.value['telefono']
    paciente.direccion = this.form.value['direccion']
    paciente.email = this.form.value['email']
    paciente.edad = this.form.value['edad']
    paciente.sexo = this.form.value['sexo']
    paciente.tipoSangre = this.form.value['tipoSangre']
    paciente.historiaClinica = this.form.value['historiaClinica']
    paciente.enfermedades = this.form.value['enfermedades']

    if (this.edicion) {
      this.pacienteService.modificar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data =>{
          this.pacienteService.pacienteCambio.next(data)
          this.pacienteService.mensajecambio.next('Paciente Modificado')
        })
      })
    }else{
      this.pacienteService.registrar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data =>{
          this.pacienteService.pacienteCambio.next(data)
          this.pacienteService.mensajecambio.next('Paciente Registrado')
        })
      })
    }
    this.router.navigate(['paciente'])
  }

}
