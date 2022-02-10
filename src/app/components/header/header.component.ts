import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public _ruta = Global.ruta;

  public usuario!: string | null;
  public nombre!: string | null;

  constructor(
    private _router: Router
  ) { 
    this.usuario = window.localStorage.getItem('usuario');
    if(this.usuario == null) {
      this._router.navigate(['/login']);
    } else {
      this.nombre = window.localStorage.getItem('nombre');
    }
  }

  ngOnInit(): void {
  }

  clearSession() {
    window.localStorage.clear();
    this._router.navigate(['/login']).then(() => {
      location.reload();
    });
  }

}
