import { ConsultaService } from './../../_service/consulta.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  tipo : string
  chart : any
  pdfSrc : string

  constructor(
    private consultaService : ConsultaService
  ) { }

  ngOnInit(): void {
    this.tipo = 'line'
    this.dibujar()
  }

  cambiar(tipo : string){
    this.tipo = tipo
    if (this.chart != null) {
      this.chart.destroy()
    }
    this.dibujar()
  }

  generarReporte(){
    this.consultaService.generarReporte().subscribe(data => {
      let reader = new FileReader()
      reader.onload = (e : any) => {
        this.pdfSrc = e.target.result
      }
      reader.readAsArrayBuffer(data)
    })
  }

  descargarReporte(){
    this.consultaService.generarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.href = url
      a.download = 'consultas.pdf'
      a.click()
    })
  }

  dibujar(){
    this.consultaService.listarResumen().subscribe(data => {
      //console.log(data)
      let cantidades = data.map(x => x.cantidad)
      let fechas = data.map(x => x.fecha)

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
            labels: fechas,
            datasets: [{
                label: 'cantidad',
                data: cantidades,
                fill : false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
            }
          ]
        },
        options: {
          legend: {
            display : false
          },
            scales: {
              xAxes: [{
                display : true
              }],
                yAxes: [{
                    display : true
                }]
            }
        }
    });
    })
  }

}
