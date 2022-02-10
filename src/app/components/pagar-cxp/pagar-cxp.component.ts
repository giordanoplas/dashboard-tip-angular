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
  selector: 'app-pagar-cxp',
  templateUrl: './pagar-cxp.component.html',
  styleUrls: ['./pagar-cxp.component.css'],
  providers: [GlobalService]
})
export class PagarCXPComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public selectedDate: any;
  public clienteID: number;

  public lugares: any;
  public lugarID: number = 0;

  public totalDeudas: number = 0;
  public totalPagos: number = 0;
  public pagoCliente: number = 0;
  public deudaPendiente: number = 0;

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
  public cliente: Model = { id: 0, nombre: "" };

  public datos: any;

  formatter = (model: Model) => model.nombre;

  searchCliente = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.clientes.filter(cliente => new RegExp(term, 'mi').test(cliente.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.clientes = new Array<Model>();
    this.clienteID = this.cliente.id;

    this.datos = {
      clienteID: 0,
      lugarID: 0,
      pago: "",
      descripcion: ""
    };
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

  getLugares() {
    if (this.cliente != null) {
      let clienteID = this.cliente.id;
      if (clienteID != null && clienteID > 0) {
        this._globalService.getDataCxCId('cliente-lugares', clienteID).subscribe(
          response => {
            if (response.status == "success") {
              this.datos.clienteID = clienteID;
              this.lugares = response.data;
            }
          },
          error => { }
        );
      }
    }
  }

  submitCliente() {
    this.getLugares();
  }

  onSubmit() {
    this._globalService.clienteAdmin('pago-cliente-cxp', this.datos).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Pago almacenado!',
            text: response.mensaje,
            icon: 'success',
            confirmButtonText: 'Cool!'
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            title: 'Error...',
            text: response.mensaje,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      },
      error => {
        Swal.fire({
          title: 'Error...',
          text: "Ha ocurrido un error inesperado!!",
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }
}
