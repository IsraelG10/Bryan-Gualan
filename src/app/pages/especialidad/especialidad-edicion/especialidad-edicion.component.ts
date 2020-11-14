import { switchMap } from 'rxjs/operators';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { Especialidad } from './../../../_model/especialidad';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  id : number
  form : FormGroup
  especialidad : Especialidad
  edicion : boolean = false

  constructor(
    private especialidadService : EspecialidadService,
    private route : ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.especialidad = new Especialidad()

    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre': new FormControl(''),
    })

    this.route.params.subscribe((params : Params) => {
      this.id = params['id']
      this.edicion = params['id'] != null
      this.initForm()
    })
  }

  initForm(){
    if (this.edicion) {
      this.especialidadService.listarPorId(this.id).subscribe(data => {
        let id = data.id
        let nombre = data.nombre

        this.form = new FormGroup({
          'id' : new FormControl(id),
          'nombre' : new FormControl(nombre),
        })
      })
    }
  }

  operar(){
    this.especialidad.id = this.form.value['id']
    this.especialidad.nombre = this.form.value['nombre']
    this.especialidad.estado = "A"

    if (this.especialidad != null && this.especialidad.id > 0) {
      this.especialidadService.modificar(this.especialidad).pipe(switchMap(() => {
      return this.especialidadService.listar()
    })).subscribe(data => {
      this.especialidadService.especialidadCambio.next(data)
      this.especialidadService.mensajecambio.next('Especialidad Modificada')
    })
    }else{
      this.especialidadService.registrar(this.especialidad).subscribe(data => {
        this.especialidadService.listar().subscribe(examen => {
          this.especialidadService.especialidadCambio.next(examen)
          this.especialidadService.mensajecambio.next('Especialidad Registrada')
        })
      })
    }
    this.router.navigate(['especialidad'])
  }

}
