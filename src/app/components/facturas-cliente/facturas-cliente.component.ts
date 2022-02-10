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
  selector: 'app-facturas-cliente',
  templateUrl: './facturas-cliente.component.html',
  styleUrls: ['./facturas-cliente.component.css'],
  providers: [GlobalService]
})
export class FacturasClienteComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public selectedDate: any;

  public facturasCliente: any;
  public paginaActual: number = 1;
  public totalPaginas: number = 1;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;
  public isSearch: boolean = false;
  public facturaPrint: any = false;

  public peso: string = "RD$";
  public subtotal: number = 0;

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
  }

  ngOnInit(): void {
    this.getClientes();
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

  onBuscar() {
    if (this.cliente != null && this.cliente.id > 0) {
      this.getFacturasCliente();
    } else {
      this.facturasCliente = null;
      this.isSearch = false;
    }
  }

  private getFacturasCliente() {
    this.facturasCliente = null;

    this._globalService.searchCuentasLogDate('facturas-cliente', this.cliente.id, this.selectedDate).subscribe(
      response => {
        if (response.status == 'success') {
          this.isSearch = true;
          this.dataSearchEmpty = false;
          this.facturasCliente = response.data;
        } else {
          this.isSearch = false;
          this.facturasCliente = null;
        }
      },
      error => { }
    );
  }

  public deleteFactura(id: number, facturaN: string) {
    if (id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta factura, no podrás recuperarla...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          this._globalService.deleteFactura("delete-factura-cliente", id, facturaN).subscribe(
            response => {
              if (response.status == 'success') {
                Swal.fire({
                  title: 'Factura eliminada!',
                  text: response.mensaje,
                  icon: 'success',
                  confirmButtonText: 'Cool...'
                }).then(() => {
                  this.getFacturasCliente();
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
          Swal.fire('Has cancelado la eliminación de esta factura...', '', 'info');
        }
      });
    }
  }

  printFactura(id: number, facturaN: string) {
    this.facturaPrint = this.facturasCliente.filter((x: any) => x.clienteID == id && x.facturaN == facturaN)[0];
    let precio = Number.parseFloat(this.facturaPrint.precio);
    let precioExtraordinario = Number.parseFloat(this.facturaPrint.precio_extraordinario);
    let precioAdicional = Number.parseFloat(this.facturaPrint.precio_adicional);
    this.subtotal = precio + precioExtraordinario + precioAdicional;

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
        if (this.facturaPrint != null) {
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

  datePickerChange() {
    this.getFacturasCliente();
  }

  onInputBuscar() {
    if(this.cliente != null && this.cliente.id > 0) {
      this.getFacturasCliente();
      this.dataSearchEmpty = this.facturasCliente == null ? true : false;
    } else {
      this.dataSearchEmpty = true;
    }   
  }

}
