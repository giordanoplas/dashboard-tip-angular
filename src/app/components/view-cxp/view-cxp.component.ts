import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faAngleDoubleLeft, faAngleDoubleRight, faSearch, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

//type Model = { id: number, nombre: string, deuda_total: number, pago_extraordinario: number, pago_adicional: number, logotipo: string };
type Model = { id: number, nombre: string, logotipo: string, direccion: string };

@Component({
  selector: 'app-view-cxp',
  templateUrl: './view-cxp.component.html',
  styleUrls: ['./view-cxp.component.css'],
  providers: [GlobalService]
})
export class ViewCXPComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public clienteID: number;

  public totalDeudas: number = 0;
  public totalPagos: number = 0;
  public pagoCliente: number = 0;
  public deudaPendiente: number = 0;

  public fechaI: string;
  public fechaF: string;

  public pagosCxC = 0;
  public pagosCxP = 0;
  public diferenciaCxP = 0;

  public cuentasClienteP: any;
  public pagoClienteLog: any;
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

  public clientes: Model[];
  //public cliente: Model = { id: 0, nombre: '', deuda_total: 0, pago_extraordinario: 0, pago_adicional: 0, logotipo: "" };
  public cliente: Model = { id: 0, nombre: '', logotipo: '', direccion: '' };

  formatter = (model: Model) => model.nombre;

  searchCliente = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.clientes.filter(cliente => new RegExp(term, 'mi').test(cliente.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.clientes = new Array<Model>();
    this.fechaI = moment(Date.now()).format('YYYY-MM-01');
    this.fechaF = moment(Date.now()).format('YYYY-MM-DD');
    this.clienteID = this.cliente.id;
  }

  ngOnInit(): void {
    this.getClientes();
    this.getCuentasClientesCxP();
    this.paginacion();
  }

  getClientes() {
    this._globalService.getDataCxC('clientes').subscribe(
      response => {
        if (response.status == "success") {
          this.clientes = response.data;
        }
      },
      error => { }
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
    if (this.isSearch) {
      this._router.navigate(['/cxp', param]).then(() => {
        this.search();
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

  private getCuentasClientesCxP() {
    this.totalDeudas = 0;
    this.totalPagos = 0;
    this.deudaPendiente = 0;
    this.isSearch = false;
    this.dataSearchEmpty = true;

    this._globalService.getDataCxC('cuentas-clientes-cxp-log').subscribe(
      response => {
        if (response.status == 'success') {
          let datos = response.data;
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
          let fin = (inicio + this.usuarios_por_pagina);
          this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);

          this.cuentasClienteP = datos.slice(inicio, fin);
        } else {
          this.cuentasClienteP = [];
        }
      },
      error => { }
    );
  }

  private getCuentasClienteCxP() {
    if (this.cliente != null && this.cliente.id > 0) {
      this._globalService.searchCuentasLogDate('search-cliente-cxp-log', this.cliente.id, this.fechaI, this.fechaF).subscribe(
        response => {
          if (response.status == 'success') {
            this.isSearch = true;
            this.dataSearchEmpty = false;

            let datos = response.data;

            let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
            let fin = (inicio + this.usuarios_por_pagina);
            this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);

            this.cuentasClienteP = datos.slice(inicio, fin);

            let pagoTotalCliente = 0;
            let pagoTotalInquilinos = 0;
            let cxc = 0;
            let cxp = 0;
            var pagosCliente = Array<any>();
            var pagosInquilinos = Array<any>();

            datos.forEach((da: any) => {
              if (da.pago != null) {
                cxp += Number.parseFloat(da.pago);
              }
            });

            this.pagosCxP = cxp;

            this._globalService.searchCuentasLogDate('search-pagos-cliente-log-date', this.cliente.id, this.fechaI, this.fechaF).subscribe(
              response => {
                if (response.status == 'success') {
                  pagosCliente = response.data;

                  pagosCliente.forEach((pc: any) => {
                    if (pc.pago != null) {
                      pagoTotalCliente += pc.pago;
                    }
                    if (pc.pago_extraordinario != null) {
                      pagoTotalCliente += pc.pago_extraordinario
                    }
                    if (pc.pago_adicional != null) {
                      pagoTotalCliente += pc.pago_adicional;
                    }
                  });

                  cxc = pagoTotalCliente + pagoTotalInquilinos;
                  this.pagosCxC = cxc;
                  this.diferenciaCxP = this.pagosCxC - this.pagosCxP;
                } else { }
              },
              error => { }
            );

            this._globalService.searchCuentasLogDate('search-cuentas-clientes-log-date', this.cliente.id, this.fechaI, this.fechaF).subscribe(
              response => {
                if (response.status == 'success') {
                  pagosInquilinos = response.data;

                  pagosInquilinos.forEach((da: any) => {
                    if (da.pago != null && da.pago > 0) {
                      let pago = Number.parseFloat(da.pago);
                      pagoTotalInquilinos += pago;
                    }
                  });

                  cxc = pagoTotalCliente + pagoTotalInquilinos;
                  this.pagosCxC = cxc;
                  this.diferenciaCxP = this.pagosCxC - this.pagosCxP;
                  console.log(this.cuentasClienteP);
                  console.log(this.isSearch);
                } else { }
              },
              error => { }
            );
          } else {
            this.isSearch = false;
            this.dataSearchEmpty = true;
            this.cuentasClienteP = [];
          }
        },
        error => { }
      );
    }
  }

  private search() {
    if (this.cliente != null && this.cliente.id > 0) {
      this.clienteID = this.cliente.id;      
      this.getCuentasClienteCxP();
    } else {
      this.cuentasClienteP = [];

      this.isSearch = false;
      this.dataSearchEmpty = true;
    }
  }

  public getDeudaPendiente() {
    return this.deudaPendiente;
  }

  public deleteCuentaCliente(id: number) {
    if (id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta cuenta, no podrás recuperarla...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          this._globalService.deleteCuenta("delete-cliente-cuenta", id).subscribe(
            response => {
              if (response.status == 'success') {
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
            error => { }
          );
        } else if (result.isDismissed) {
          Swal.fire('Has cancelado la eliminación de esta cuenta...', '', 'info');
        }
      });
    }
  }

  public deleteCuentaInquilino(id: number) {
    if (id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta cuenta, no podrás recuperarla...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          this._globalService.deleteCuenta("delete-inquilino-cuenta", id).subscribe(
            response => {
              if (response.status == 'success') {
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
            error => { }
          );
        } else if (result.isDismissed) {
          Swal.fire('Has cancelado la eliminación de esta cuenta...', '', 'info');
        }
      });
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

  datePickerChange() {
    this.search();
  }

  onInputBuscar() {    
    if(this.cliente == null) {
      this.cuentasClienteP = null;
      this.isSearch = false;
      this.dataSearchEmpty = true;
    } else {
      this.isSearch = true;
      this.dataSearchEmpty = false;
    }
  }

}
