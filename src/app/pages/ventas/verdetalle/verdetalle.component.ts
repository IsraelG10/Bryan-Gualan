import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentaListaProductoDTO } from 'src/app/_dto/VentaListaProductoDTO';
import { Ventas } from 'src/app/_model/ventas';
import { VentasService } from 'src/app/_service/ventas.service';

@Component({
  selector: 'app-verdetalle',
  templateUrl: './verdetalle.component.html',
  styleUrls: ['./verdetalle.component.css']
})
export class VerdetalleComponent implements OnInit {

  ventas : Ventas
  productos : VentaListaProductoDTO[] = []

  constructor(
    private dialogRef : MatDialogRef<VerdetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : Ventas,
    private ventasService : VentasService
  ) { }

  ngOnInit(): void {
    this.ventas = this.data
    this.listarExamenes()
  }

  listarExamenes(){
    this.ventasService.listarProductoPorVenta(this.ventas.idVenta).subscribe(data => {
      this.productos = data
    })
  }

  cancelar(){
    this.dialogRef.close()
  }

}
