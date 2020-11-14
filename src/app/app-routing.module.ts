import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { Not403Component } from './pages/not403/not403.component';
import { GuardService } from './_service/guard.service';
import { LoginComponent } from './pages/login/login.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { WizardComponent } from './pages/consulta/wizard/wizard.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { SignoComponent } from './pages/signo/signo.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { VentasComponent } from './pages/ventas/ventas.component';


const routes: Routes = [

  {path:'paciente', component: PacienteComponent, children: [
    {path:'nuevo', component: PacienteEdicionComponent},
    {path:'edicion/:id', component: PacienteEdicionComponent}
  ], canActivate: [GuardService]
},

  {path: 'medico', component: MedicoComponent, canActivate: [GuardService]},

  {path: 'examen', component: ExamenComponent, children: [
    {path: 'nuevo', component: ExamenEdicionComponent},
    {path: 'edicion/:id', component: ExamenEdicionComponent}
  ], canActivate: [GuardService]
},

  {path: 'especialidad', component: EspecialidadComponent, children: [
    {path: 'nuevo', component: EspecialidadEdicionComponent},
    {path: 'edicion/:id', component: EspecialidadEdicionComponent}
  ], canActivate: [GuardService]
},

  {path: 'consulta', component: ConsultaComponent, canActivate: [GuardService]},

  {path: 'especial', component: EspecialComponent, canActivate: [GuardService]},

  {path: 'consulta_wizard', component: WizardComponent, canActivate: [GuardService]},

  {path: 'buscar', component: BuscarComponent, canActivate: [GuardService]},

  {path: 'reportes', component: ReportesComponent, canActivate: [GuardService]},
  {
    path: 'signos', component: SignoComponent, canActivate: [GuardService]
  },
  {
    path: 'productos', component: ProductosComponent, canActivate: [GuardService]
  },
  {
    path: 'ventas', component: VentasComponent, canActivate: [GuardService]
  },
  {path: 'login', component: LoginComponent},
  {path: 'not403', component: Not403Component},
  {path: 'recuperar', component: RecuperarComponent, children: [
    {path: ':token', component: TokenComponent}
  ]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
