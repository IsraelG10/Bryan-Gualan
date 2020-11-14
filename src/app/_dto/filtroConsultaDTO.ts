export class FiltroConsultaDTO{
  cedula: string
  nombreCompleto: string
  fechaConsulta: Date

  constructor(cedula: string, nombreCompleto: string, fechaConsulta: Date){
    this.cedula = cedula
    this.nombreCompleto = nombreCompleto
    this.fechaConsulta = fechaConsulta
  }

}
