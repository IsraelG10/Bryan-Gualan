import { Especialidad } from './especialidad';
import { Medico } from './medico';
import { Paciente } from './paciente';
import { DetalleConsulta } from './detalleConsulta';

export class Consulta{
  idConsulta : number
  paciente : Paciente
  medico : Medico
  especialidad : Especialidad
  fecha : string
  numPiso : string
  detalleConsulta : DetalleConsulta[]
}
