import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faAngleDoubleLeft, faAngleDoubleRight, faSearch, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';

@Component({
  selector: 'app-cuentas-inquilino',
  templateUrl: './cuentas-inquilino.component.html',
  styleUrls: ['./cuentas-inquilino.component.css'],
  providers: [GlobalService]
})
export class CuentasInquilinoComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;

  public cliente: any;
  public cuentasInquilinosP: any;
  public paginaActual: number = 1;
  public totalPaginas: number = 1;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;
  public isSearch: boolean = false;

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faSearch = faSearch;
  faPrint = faPrint;
  faTrash = faTrash;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCuentasInquilinosLog();
    this.paginacion();
  }

  private getCuentasInquilinosLog() {
    this._globalService.getDataCxC('cuentas-inquilinos-log').subscribe(
      response => {
        if(response.status == 'success') {
          let datos = response.data;
          
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
          let fin = (inicio + this.usuarios_por_pagina);
          this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);

          this.cuentasInquilinosP = datos.slice(inicio, fin);
        } else {
          this.cuentasInquilinosP = null;
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
      this._router.navigate(['/cuentas-inquilino', param]).then(() => {
        this.search();
      });
    } else {
      this._router.navigate(['/cuentas-inquilino', param]).then(() => {              
        this.getCuentasInquilinosLog();
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

  onBuscar() {
    this.search();
  }

  private search() {
    if(this.nombreSearch.length > 0) {
      this._globalService.searchCuentasLog('search-cuentas-inquilinos-log', this.nombreSearch).subscribe(
        response => {
          if(response.status == 'success') {
            this.isSearch = true;            
            let datos = response.data;
            
            let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
            let fin = (inicio + this.usuarios_por_pagina);
            this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);
  
            this.cuentasInquilinosP = datos.slice(inicio, fin);
          } else {
            this.isSearch = false;
            this.cuentasInquilinosP = null;
            this.dataSearchEmpty = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.isSearch = false;
      this.getCuentasInquilinosLog();
    }
  }

  printTable() {
    var header = document.getElementById("header_print");
    header?.classList.remove('d-none');
    printJS({
      printable: "data_print",
      type: 'html',
      targetStyles: ['*']
      //style: '.custom-h3 { color: red; }'
    });
    header?.classList.add('d-none');
  }

  deleteCuentaInquilino(id: number) {
    if(id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta cuenta, no podrás recuperarla...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if(result.isConfirmed) {
          this._globalService.deleteCuenta("delete-inquilino-cuenta", id).subscribe(
            response => {
              if(response.status == 'success') {
                Swal.fire({
                  title: 'Cuenta Eliminada!',
                  text: response.mensaje,
                  icon: 'success',
                  confirmButtonText: 'Cool...'
                }).then(() => {
                  this.search();
                });
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: response.mensaje,
                  icon: 'error',
                  confirmButtonText: 'Ok!'
                });
              }
            },
            error => {}
          ); 
        } else if(result.isDismissed) {
          Swal.fire('Has cancelado la eliminación de esta cuenta...', '', 'info');
        }
      });      
    }
  }

}
