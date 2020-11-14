import { ServerErrorsInterceptor } from './_shared/server-error.interceptor';
import { MaterialModule } from './material/material.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { MedicoDialogoComponent } from './pages/medico/medico-dialogo/medico-dialogo.component';
import { FormsModule } from '@angular/forms';
import { ExamenComponent } from './pages/examen/examen.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { WizardComponent } from './pages/consulta/wizard/wizard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { DetalleDialogoComponent } from './pages/buscar/detalle-dialogo/detalle-dialogo.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './pages/login/login.component';
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { Not403Component } from './pages/not403/not403.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { SignoComponent } from './pages/signo/signo.component';
import { SignosEditComponent } from './pages/signo/signos-edit/signos-edit.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ProductosEditComponent } from './pages/productos/productos-edit/productos-edit.component';
import { VentasEditComponent } from './pages/ventas/ventas-edit/ventas-edit.component';
import { VerdetalleComponent } from './pages/ventas/verdetalle/verdetalle.component';

export function tokenGetter() {
  let tk = sessionStorage.getItem(environment.TOKEN_NAME)
  return tk != null ? tk : ''
}

@NgModule({
  declarations: [
    AppComponent,
    PacienteComponent,
    PacienteEdicionComponent,
    MedicoComponent,
    MedicoDialogoComponent,
    ExamenComponent,
    ExamenEdicionComponent,
    ConsultaComponent,
    EspecialidadComponent,
    EspecialidadEdicionComponent,
    EspecialComponent,
    WizardComponent,
    BuscarComponent,
    DetalleDialogoComponent,
    ReportesComponent,
    LoginComponent,
    Not403Component,
    RecuperarComponent,
    TokenComponent,
    SignoComponent,
    SignosEditComponent,
    ProductosComponent,
    VentasComponent,
    ProductosEditComponent,
    VentasEditComponent,
    VerdetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: ["http://localhost:8080/login/enviarCorreo"],
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
