import { MenuService } from './../../_service/menu.service';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { LoginService } from './../../_service/login.service';
import { Component, OnInit } from '@angular/core';
import '../../login-animation.js';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string
  clave: string

  mensaje: string
  error: string

  constructor(
    private loginService: LoginService,
    private menuService : MenuService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      //console.log(data)
      const helper = new JwtHelperService();
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token)

      const decodedToken = helper.decodeToken(data.access_token)
      //console.log(decodedToken)
      this.router.navigate(['/paciente'])

      this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
        this.menuService.menucambio.next(data)
        this.router.navigate(['/paciente'])
      })
    })
  }

}
