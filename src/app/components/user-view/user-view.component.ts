import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
  providers: [GlobalService]
})
export class UserViewComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;
  public usuarios_por_pagina = Global.usuarios_por_pagina;

  public usersP: any;
  public paginaActual: number = 1;
  public totalPaginas: number = 1;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;
  public isSearch: boolean = false;

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.paginacion();
  }

  private getUsers() {
    this._globalService.getData('usuarios').subscribe(
      response => {
        if(response.status == 'success') {
          let usersLog = response.data;
          
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
          let fin = (inicio + this.usuarios_por_pagina);
          this.totalPaginas = Math.ceil(usersLog.length / this.usuarios_por_pagina);

          this.usersP = usersLog.slice(inicio, fin);
        } else {
          this.usersP = null;
        }
      },
      error => {}
    );
  }

  private paginacion() {
    this._route.params.subscribe((params) => {
      let p = params.p;
      this.paginaActual = p ? p : 1;
    });
  }

  createRange(number: number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  link(param: any) {
    if(this.isSearch) {
      this._router.navigate(['/usuarios', param]).then(() => {
        this.search();
      });
    } else {
      this._router.navigate(['/usuarios', param]).then(() => {              
        this.getUsers();
      }); 
    }       
  }

  nextPage() {
    let n = this.paginaActual;
    n++;
    return n;
  }

  prevPage() {
    let n = this.paginaActual;
    n--;
    return n;
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onBuscar() {
    this.search();
  }

  private search() {
    if(this.nombreSearch.length > 0) {
      this._globalService.searchUsersLog('buscar-usuarios', this.nombreSearch).subscribe(
        response => {
          if(response.status == 'success') {
            this.isSearch = true;            
            let usersLog = response.data;
            
            let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
            let fin = (inicio + this.usuarios_por_pagina);
            this.totalPaginas = Math.ceil(usersLog.length / this.usuarios_por_pagina);
  
            this.usersP = usersLog.slice(inicio, fin);
          } else {
            this.isSearch = false;
            this.usersP = null;
            this.dataSearchEmpty = true;
          }
        },
        error => {}
      );
    } else {
      this.isSearch = false;
      this.getUsers();
    }
  }

}
