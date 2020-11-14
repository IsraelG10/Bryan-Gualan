import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Ventas } from 'src/app/_model/ventas';
import { PacienteService } from 'src/app/_service/paciente.service';
import { VentasService } from 'src/app/_service/ventas.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Producto } from 'src/app/_model/productos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductosService } from 'src/app/_service/productos.service';
import { VentaListaProductoDTO } from 'src/app/_dto/VentaListaProductoDTO';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';

@Component({
  selector: 'app-ventas-edit',
  templateUrl: './ventas-edit.component.html',
  styleUrls: ['./ventas-edit.component.css']
})
export class VentasEditComponent implements OnInit {

  form : FormGroup

  pacientes : Paciente[] = []
  producto : Producto[] = []
  productoSeleccionados : Producto[] = []

  @Input() disabled = false;

  diagnostico : string
  tratamiento : string
  mensaje : string
  valor1=0;
  valor2=0;
  total: number;

  pacienteSeleccionado : Paciente
  productoSeleccionado : Producto
  cantidad: Producto;


  myControlPaciente: FormControl = new FormControl()

  pacientesFiltrados: Observable<any[]>

  maxFecha : Date = new Date()
  fechaSeleccionada : Date = new Date()

  constructor(
    private dialogRef : MatDialogRef<VentasEditComponent>,
    private pacienteService : PacienteService,
    private productosService : ProductosService,
    private snackBar : MatSnackBar,
    private ventasService : VentasService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'paciente' : this.myControlPaciente,
      'total' : new FormControl,
      'fecha' : new FormControl(new Date),
      'valor1': new FormControl('')
    })

    this.listarPacientes()
    this.listarExamenes()

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val =>
      this.filtrarPaciente(val)))
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

  agregarExamen(){
    if (this.productoSeleccionado) {
      let cont = 0
      for (let i = 0; i < this.productoSeleccionados.length; i++) {
        let examen = this.productoSeleccionados[i]
        if (examen.idProducto === this.productoSeleccionado.idProducto) {
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
          this.productoSeleccionados.push(this.productoSeleccionado)
      }
    }else{
      this.mensaje = 'Debe de seleccionar un examen'
      this.snackBar.open(this.mensaje, 'Aviso', {
        duration : 3000
      })
    }
  }

  removerExamen(index:number){
    this.productoSeleccionados.splice(index, 1)
  }

  listarExamenes(){
    this.productosService.listar().subscribe(data => {
      this.producto = data
    })
  }

  aceptar(){
    let consulta = new Ventas()
    consulta.total = this.form.value['total']
    //consulta.especialidad = this.especialidadSeleccionada
    consulta.paciente = this.form.value['paciente']


    let tzoffset = (this.fechaSeleccionada).getTimezoneOffset()*60000
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString()

    consulta.fecha = localISOTime

    let consultaListaExamenDTO = new VentaListaProductoDTO()
    consultaListaExamenDTO.venta = consulta
    consultaListaExamenDTO.lstProducto = this.productoSeleccionados


    this.ventasService.registrar(consultaListaExamenDTO).subscribe( () =>{
      this.snackBar.open("Se registro", "Aviso", {
        duration: 3000
      });

      setTimeout(() => {
        this.limpiarControles()
      }, 3000)

    })
    this.dialogRef.close();

  }

  limpiarControles(){
    this.fechaSeleccionada = new Date()
    this.fechaSeleccionada.setHours(0)
    this.fechaSeleccionada.setMinutes(0)
    this.fechaSeleccionada.setSeconds(0)
    this.mensaje = ''
  }

  Sumar() {
      this.valor2 = this.productoSeleccionado.precio;
      if (this.productoSeleccionado.cantidad > this.productoSeleccionado.cantidad) {
        this.mensaje = 'El Producto no puede ser Ingresado NO hay tantos'
      } else {
      this.total = this.valor1 + this.valor2;
    }

  }

}
