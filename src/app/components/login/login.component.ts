import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [GlobalService]
})
export class LoginComponent implements OnInit {

  public _ruta = Global.ruta;

  public userString: string;
  public passString: string;
  public usuario!: Usuario; 
  public loginError: boolean;

  constructor(
    private _globalService: GlobalService,
    private _router: Router
  ) { 
    this.userString = "";
    this.passString = "";
    this.loginError = false;
  }

  ngOnInit(): void {
  }

  goLogin() {
    this._globalService.getLogin(this.userString, this.passString).subscribe(
      response => {
        if(response.usuario) {
          this.usuario = response.usuario;
          if(this.usuario.rol == "Administrador") {

            window.localStorage.setItem("usuario", this.usuario.usuario);
            window.localStorage.setItem("nombre", this.usuario.nombre);
            window.localStorage.setItem("email", this.usuario.email);
            window.localStorage.setItem("rol", this.usuario.rol);

            this._router.navigate(['/'])
              .then(() => {
                location.reload();
              });
          } else {
            this.loginError = true;
          }
        } else {
          this.loginError = true;
        }
      },
      error => {
        this.loginError = true;
      }
    )
  }

}
