import { map } from 'rxjs/operators';
import { Menu } from './../_model/menu';
import { MenuService } from './menu.service';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private loginService: LoginService,
    private menuService : MenuService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const helper = new JwtHelperService();
    let rpta = this.loginService.estaLogueado()

    if (!rpta) {
      //1. SI EL USUARIO ESTA LOGUEADO
      this.loginService.cerrarSesion()
      return false
    }else{
       //2. SI EL TOKEN ESTA EXPIRADO
       let token = sessionStorage.getItem(environment.TOKEN_NAME)
       if (!helper.isTokenExpired(token)) {
         //3. SI TIENE EL ROL NECESARIO
         let url = state.url
         const decodedToken = helper.decodeToken(token)
         return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
           this.menuService.menucambio.next(data)

           let cont = 0
           for(let m of data){
             if(url.startsWith(m.url)){
                cont++
                break
             }
           }

           if(cont > 0){
            return true
           }else{
            this.router.navigate(['not403'])
            return false
           }
         }))
       }else{
         this.loginService.cerrarSesion()
         return false
       }
    }

  }

}
