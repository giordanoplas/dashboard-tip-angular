import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashboard-tip';
  
  public usuario: any;
  public rol: any;

  constructor(
    private _router: Router
  ) {
    this.usuario = window.localStorage.getItem('usuario');
    this.rol = window.localStorage.getItem('rol');
    if(this.usuario == null || this.rol != "Administrador") {
      this._router.navigate(['/login']);
    }
  }
}
