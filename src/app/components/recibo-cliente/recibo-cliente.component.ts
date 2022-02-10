import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from "../../services/global";
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as moment from 'moment';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-recibo-cliente',
  templateUrl: './recibo-cliente.component.html',
  styleUrls: ['./recibo-cliente.component.css'],
  providers: [GlobalService]
})
export class ReciboClienteComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;

  public totalPagos: number = 0;
  public deudaPendiente: number = 0;

  public peso: string = "RD$";
  public facturaMsn: string = "";
  public facturaStr: string = "";
  public isFactura: boolean = false;

  public cliente: any;
  public datos: any;
  private isPrintF: boolean = false;

  public lugares: any;
  public lugarID: number = 0;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.datos = {
      clienteID: 0,
      lugarID: 0,
      facturaN: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      pago: "",
      pagoExtraordinario: "",
      pagoAdicional: "",
      total: 0,
      rnc: "",
      ncf: "",
      fecha_ultimo_pago: "",
      detalle: ""
    }
  }

  ngOnInit(): void {
    this.getCliente();
    this.getLugares();
  }

  getLugares() {
    this._route.params.subscribe((params) => {
      let clienteID = params.clienteID;
      if (clienteID != null && clienteID > 0) {
        this._globalService.getDataCxCId('cliente-lugares', clienteID).subscribe(
          response => {
            if (response.status == "success") {
              this.lugares = response.data;
            }
          },
          error => { }
        );
      }
    });
  }

  getCliente() {
    this._route.params.subscribe((params) => {
      let clienteID = params.clienteID;
      if (clienteID != null && clienteID > 0) {
        this._globalService.getDataCxCId('deudas-cliente', clienteID).subscribe(
          response => {
            if (response.status == 'success') {
              this.cliente = response.data;
              this.datos.clienteID = this.cliente.clienteID;
              this.datos.lugarID = this.cliente.lugarID;
              this.datos.rnc = this.cliente.rnc;
              this.datos.ncf = this.cliente.ncf;
              this.datos.fecha_ultimo_pago = this.cliente.fecha_ultimo_pago;
            }
          },
          error => { }
        );
      } else {
        this._router.navigate(['/'])
          .then(() => {
            location.reload();
          });
      }
    });
  }

  onSubmit() {
    if (this.isFactura) {
      if (this.isPrintF) {
        var printF = document.getElementById("print_f_html");
        printF?.classList.remove("d-none");
        printJS({
          printable: "print_f_html",
          type: 'html',
          //header: '<h2>' + this._customHeader + '</h2>',
          targetStyles: ['*']
        });
        printF?.classList.add("d-none");
      }
      
      this._globalService.clienteAdmin('pago-cliente', this.datos).subscribe(
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

  onPrintChecked(event: any) {
    let checked = event.target.checked;

    if (checked) {
      this.isPrintF = true;
    } else {
      this.isPrintF = false;
    }
  }

  onPrintCheckedRNC(event: any) {
    let checked = event.target.checked;

    if (checked) {
      this.datos.rnc = this.cliente.rnc;
      this.datos.ncf = this.cliente.ncf;
    } else {
      this.datos.rnc = "";
      this.datos.ncf = "";
    }
  }

  onInputFactura(event: any) {
    var value = event.target.value;
    if (value != null && value.length > 5) {
      this._globalService.getFacturaCxC('factura-numero-cliente', value).subscribe(
        response => {
          if (response.status == "success") {
            var data = response.data;
            this.datos.facturaN = data[0].numero;
            this.isFactura = true;
            this.facturaMsn = "";
          } else {
            this.datos.facturaN = "";
            this.isFactura = false;
            this.facturaMsn = "Factura no existente!"
          }
        },
        error => {
          this.datos.facturaN = "";
          this.isFactura = false;
        }
      )
      this.isFactura = true;
    } else {
      this.datos.facturaN = "";
      this.isFactura = false;
    }
  }

  onInputPagos() {
    let pago = this.datos.pago != "" ? Number.parseFloat(this.datos.pago) : 0;
    let pagoExtraordinario = this.datos.pagoExtraordinario != "" ? Number.parseFloat(this.datos.pagoExtraordinario) : 0;
    let pagoAdicional = this.datos.pagoAdicional != "" ? Number.parseFloat(this.datos.pagoAdicional) : 0;
    this.datos.total = pago + pagoExtraordinario + pagoAdicional;
  }

}
