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

type Model = { id: number, nombre: string, deuda_total: number, pago_extraordinario: number, pago_adicional: number, logotipo: string, direccion: string };

@Component({
  selector: 'app-clientes-cuentas',
  templateUrl: './clientes-cuentas.component.html',
  styleUrls: ['./clientes-cuentas.component.css'],
  providers: [GlobalService]
})
export class ClientesCuentasComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public selectedDate: any;
  public clienteID: number;

  public peso: string = "RD$"

  public totalDeudas: number = 0;
  public totalPagos: number = 0;
  public pagoCliente: number = 0;
  public deudaPendiente: number = 0;
  public reciboPrint: any;
  public datos: any;
  public datosInquilino: any;

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
  public cliente: Model = { id: 0, nombre: '', deuda_total: 0, pago_extraordinario: 0, pago_adicional: 0, logotipo: "", direccion: "" };

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
    this.selectedDate = moment(Date.now()).format('YYYY-MM-DD');
    this.clienteID = this.cliente.id;
    this.datos = {
      detalle: "",
      deudaCliente: 0,
      pago: 0,
      pagoExtraordinario: 0,
      pagoAdicional: 0,      
      total: 0,
      facturaN: "",
      fecha: ""
    }
    this.datosInquilino = {
      inquilino: "",
      rnc: "",
      ncf: "",
      detalle: "",
      pago: 0,   
      facturaN: "",
      fecha: ""
    }
  }

  ngOnInit(): void {
    this.getClientes();
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
      this._router.navigate(['/cuentas-clientes', param]).then(() => {
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

  private getCuentasCliente() {
    if(this.pagoClienteLog == null) {
      this.isSearch = false;
      this.dataSearchEmpty = true;
    } else {
      this.isSearch = true;
      this.dataSearchEmpty = false;
    }

    this._globalService.searchCuentasLogDate('search-cuentas-clientes-log-date', this.cliente.id, this.selectedDate).subscribe(
      response => {        
        if (response.status == 'success') {
          this.isSearch = true;
          this.dataSearchEmpty = false;

          let datos = response.data;
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
          let fin = (inicio + this.usuarios_por_pagina);
          this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);

          this.cuentasClienteP = datos.slice(inicio, fin);

          let totalPagos = 0;
          let totalDeudas = 0;
          let deudaCliente = 0;
          datos.forEach((x: any) => {
            let deuda = Number.parseFloat(x.deuda_cliente);
            deudaCliente += deuda;
          });
          this.datos.deudaCliente = deudaCliente;
          let deudaEx = this.cliente.pago_extraordinario != null ? Number.parseFloat(this.cliente.pago_extraordinario.toString()) : 0;
          let deudaAd = this.cliente.pago_adicional != null ? Number.parseFloat(this.cliente.pago_adicional.toString()) : 0;
          let deudaTotal = deudaCliente+deudaEx+deudaAd;                    

          datos.forEach((da: any) => {
            if (da.pago != null && da.pago > 0) {
              let pago = Number.parseFloat(da.pago);
              totalPagos += pago;
            }
            if (da.deuda != null && da.deuda > 0) {
              let deuda = Number.parseFloat(da.deuda);
              totalDeudas += deuda;
            }
          });

          this.totalDeudas = totalDeudas;
          this.totalPagos = totalPagos;
          this.deudaPendiente = deudaTotal - (totalPagos + this.pagoCliente);
        } else {
          this.cuentasClienteP = null;
        }
      },
      error => {}
    );
  }

  private search() {
    this.clienteID = this.cliente.id;

    this.totalDeudas = 0;
    this.totalPagos = 0;
    this.deudaPendiente = 0;

    this.isSearch = false;

    if (this.cliente != null && this.cliente.id > 0) {
      this._globalService.searchCuentasLogDate('search-pagos-cliente-log-date', this.cliente.id, this.selectedDate).subscribe(
        response => {
          if (response.status == 'success') {
            this.pagoClienteLog = response.data;
            let pago = 0;
            let deudaCliente = Number.parseFloat(this.pagoClienteLog[0].deuda_cliente);
            this.datos.deudaCliente = deudaCliente;
            let pagoEx = 0;
            let pagoAd = 0;

            this.pagoClienteLog.forEach((pc: any) => {
              if(pc.pago != null) {
                pago += pc.pago;
              }
              if(pc.pago_extraordinario != null) {
                pagoEx += pc.pago_extraordinario
              }   
              if(pc.pago_adicional != null) {
                pagoAd += pc.pago_adicional;
              }           
            });
            this.pagoCliente = pago + pagoEx + pagoAd;
            this.deudaPendiente = deudaCliente - this.pagoCliente;
            this.getCuentasCliente();
          } else {
            this.pagoClienteLog = null;           
            this.deudaPendiente = 0; 
            this.getCuentasCliente();
          }
        },
        error => {}
      );
    } else {
      this.cuentasClienteP = null;
      this.isSearch = false;
    }
  }

  public getDeudaPendiente() {
    return this.deudaPendiente;
  }

  public deleteCuentaCliente(id: number) {
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
          this._globalService.deleteCuenta("delete-cliente-cuenta", id).subscribe(
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

  public deleteCuentaInquilino(id: number) {
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
    this.isSearch = this.cliente == null || this.dataSearchEmpty ? false : true;
  }

  printReciboCliente(id: number, facturaN: string) {
    this.reciboPrint = this.pagoClienteLog.filter((x: any) => x.cuentaClienteID == id && x.facturaN == facturaN)[0];

    let pago = Number.parseFloat(this.reciboPrint.pago);
    let pagoExtraordinario = Number.parseFloat(this.reciboPrint.pago_extraordinario);
    let pagoAdicional = Number.parseFloat(this.reciboPrint.pago_adicional);
    let total = pago + pagoExtraordinario + pagoAdicional;

    this.datos.pago = pago;
    this.datos.pagoExtraordinario = pagoExtraordinario;
    this.datos.pagoAdicional = pagoAdicional;
    this.datos.total = total;
    this.datos.detalle = this.reciboPrint.detalle
    this.datos.facturaN = this.reciboPrint.facturaN;
    this.datos.fecha = this.reciboPrint.fecha_pago;

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Deseas imprimir esta factura?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Imprimir!',
      confirmButtonColor: '#0530a1'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.reciboPrint != null) {
          var printF = document.getElementById("print_f_html");
          printF?.classList.remove("d-none");
          printJS({
            printable: "print_f_html",
            type: 'html',
            targetStyles: ['*']
          });
          printF?.classList.add("d-none");
        }
      } else if (result.isDismissed) {
        Swal.fire('Has cancelado la impresión de esta factura...', '', 'info');
      }
    });
    
  }

  printReciboInquilino(id: number, facturaN: string) {
    this.reciboPrint = this.cuentasClienteP.filter((x: any) => x.cuentaInquilinoID == id && x.facturaN == facturaN)[0];

    let pago = Number.parseFloat(this.reciboPrint.pago);

    this.datosInquilino.inquilino = this.reciboPrint.inquilino;
    this.datosInquilino.rnc = this.reciboPrint.rnc;
    this.datosInquilino.ncf = this.reciboPrint.ncf;
    this.datosInquilino.detalle = this.reciboPrint.detalle;
    this.datosInquilino.pago = pago;
    this.datosInquilino.facturaN = this.reciboPrint.facturaN;
    this.datosInquilino.fecha = this.reciboPrint.fecha_pago;

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Deseas imprimir esta factura?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Imprimir!',
      confirmButtonColor: '#0530a1'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.reciboPrint != null) {
          var printF = document.getElementById("print_f_html_inquilino");
          printF?.classList.remove("d-none");
          printJS({
            printable: "print_f_html_inquilino",
            type: 'html',
            targetStyles: ['*']
          });
          printF?.classList.add("d-none");
        }
      } else if (result.isDismissed) {
        Swal.fire('Has cancelado la impresión de esta factura...', '', 'info');
      }
    });
    
  }

}
