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

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-view-nominas',
  templateUrl: './view-nominas.component.html',
  styleUrls: ['./view-nominas.component.css'],
  providers: [GlobalService]
})
export class ViewNominasComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public selectedDate: any;
  public empleadoID: number;

  public peso: string = "RD$"

  public totalDeudas: number = 0;
  public totalPagos: number = 0;
  public pagoCliente: number = 0;
  public deudaPendiente: number = 0;
  public reciboPrint: any;
  public datos: any;
  public datosInquilino: any;

  public empleadosNominasP: any;
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

  public empleados: Model[];
  public empleado: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchEmpleado = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.empleados.filter(empleado => new RegExp(term, 'mi').test(empleado.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.empleados = new Array<Model>();
    this.selectedDate = moment(Date.now()).format('YYYY-MM-DD');
    this.empleadoID = this.empleado.id;

    this.datos = {
      cliente: "",
      logotipo: "",
      direccion: "",
      empleado: "",      
      detalle: "",
      pago: 0,
      tss: 0,
      total: 0,
      fecha: "",
    }
  }

  ngOnInit(): void {
    this.getEmpleados();
    this.getEmpleadosNomina();
    this.paginacion();
  }

  getEmpleados() {
    this._globalService.getDataCxC('empleados').subscribe(
      response => {
        if (response.status == "success") {
          this.empleados = response.data;
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
      this._router.navigate(['/nominas', param]).then(() => {
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

  private getEmpleadosNomina() {
    this._globalService.getDataCxC('empleados-nomina').subscribe(
      response => {        
        if (response.status == 'success') {
          let datos = response.data;
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
          let fin = (inicio + this.usuarios_por_pagina);
          this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);

          this.empleadosNominasP = datos.slice(inicio, fin);
        } else {
          this.empleadosNominasP = null;
        }
      },
      error => {}
    );
  }

  private search() {
    this.empleadoID = this.empleado.id;
    this.isSearch = false;

    if (this.empleado != null && this.empleado.id > 0) {
      this._globalService.searchCuentasId('search-empleado-nomina', this.empleado.id).subscribe(
        response => {
          if (response.status == 'success') {
            this.isSearch = true;
            this.dataSearchEmpty = false;

            let datos = response.data;
            let inicio = (this.paginaActual > 1) ? this.paginaActual * this.usuarios_por_pagina - this.usuarios_por_pagina : 0;
            let fin = (inicio + this.usuarios_por_pagina);
            this.totalPaginas = Math.ceil(datos.length / this.usuarios_por_pagina);
  
            this.empleadosNominasP = datos.slice(inicio, fin);
          } else {
            this.isSearch = false;
            this.dataSearchEmpty = true;

            this.empleadosNominasP = null;
          }
        },
        error => {}
      );
    } else {
      this.isSearch = false;
      this.dataSearchEmpty = true;

      this.empleadosNominasP = null;      
    }
  }

  public deletePago(id: number) {
    if(id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas este pago, no podrás recuperarlo...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if(result.isConfirmed) {
          this._globalService.deleteCuenta("delete-pago-empleado", id).subscribe(
            response => {
              if(response.status == 'success') {
                Swal.fire({
                  title: 'Pago Eliminado!',
                  text: response.mensaje,
                  icon: 'success',
                  confirmButtonText: 'Cool...'
                }).then(() => {
                  this.getEmpleadosNomina();
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
          Swal.fire('Has cancelado la eliminación de este pago..', '', 'info');
        }
      });      
    }
  }

  onInputBuscar() {
    this.isSearch = this.empleado == null || this.dataSearchEmpty ? false : true;
    if(this.empleado == null || this.empleado.id == 0) {
      this.getEmpleadosNomina();
    }
  }

  printRecibo(id: number) {
    this.reciboPrint = this.empleadosNominasP.filter((x: any) => x.empleadoPagoID == id)[0];
    
    let pago = Number.parseFloat(this.reciboPrint.pago);
    let tss = Number.parseFloat(this.reciboPrint.tss);
    let total = pago + tss;

    this.datos.cliente = this.reciboPrint.cliente;
    this.datos.logotipo = this.reciboPrint.logotipo;
    this.datos.direccion = this.reciboPrint.direccion;
    this.datos.empleado = this.reciboPrint.empleado;
    this.datos.pago = pago;
    this.datos.tss = tss;
    this.datos.total = total;
    this.datos.detalle = this.reciboPrint.detalle;
    this.datos.fecha = this.reciboPrint.fecha_pago;

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Deseas imprimir este recibo?',
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
        Swal.fire('Has cancelado la impresión de este recibo...', '', 'info');
      }
    });
    
  }

}
