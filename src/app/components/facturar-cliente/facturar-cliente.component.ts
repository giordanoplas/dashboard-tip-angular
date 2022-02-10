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
  selector: 'app-facturar-cliente',
  templateUrl: './facturar-cliente.component.html',
  styleUrls: ['./facturar-cliente.component.css'],
  providers: [GlobalService]
})
export class FacturarClienteComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;

  public dataTable: any;
  public peso: string = "RD$"

  public totalPagos: number = 0;
  public deudaPendiente: number = 0;

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
      numero: "",
      precio: "",
      precioExtraordinario: "",
      precioAdicional: "",
      rnc: "",
      ncf: "",
      detalle: "",
      nota: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      vh: "",
      total: 0,
      itbis: 0,
      totalGeneral: 0
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
        this._globalService.getDataCxCId('deudas-cliente-factura', clienteID).subscribe(
          response => {
            if (response.status == 'success') {
              this.cliente = response.data;
              this.dataTable = Array<any>();

              this.datos.clienteID = this.cliente[0].clienteID;
              this.datos.rnc = this.cliente[0].rnc;
              this.datos.ncf = this.cliente[0].ncf;

              this.cliente.forEach((cli: any) => {
                this.dataTable.push(
                  { lugarID: cli.lugarID, lugar: cli.lugar, precio: 0, precioExtraordinario: 0, precioAdicional: 0, subtotal: 0 }
                );
              });

              this._globalService.getDataCxC('factura-cliente-ultimo-codigo').subscribe(
                response => {
                  if (response.status == 'success' && response.data.ultimo_codigo != null) {
                    let numeroS = response.data.ultimo_codigo;
                    let numeroI = Number.parseInt(numeroS);
                    numeroI = numeroI + 1;
                    this.datos.numero = ('000000' + numeroI).slice(-6);
                    let vhY = Number.parseInt(moment(this.datos.fecha).format('YYYY'));
                    vhY = vhY + 1
                    let vhD = vhY + '-' + moment(this.datos.fecha).format('MM') + '-' +
                      moment(this.datos.fecha).format('DD')
                    this.datos.vh = vhD;
                  } else {
                    this.datos.numero = "000001";
                    let vhY = Number.parseInt(moment(this.datos.fecha).format('YYYY'));
                    vhY = vhY + 1
                    let vhD = vhY + '-' + moment(this.datos.fecha).format('MM') + '-' +
                      moment(this.datos.fecha).format('DD')
                    this.datos.vh = vhD;
                  }
                },
                error => { }
              );
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
    //console.log(this.datos);
    /*  
    let mesActual = Number.parseInt(moment(Date.now()).format("MM"));
    let mesUltPago = Number.parseInt(moment(this.cliente.fecha_ultimo_pago).format("MM")); 
    */   
    
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

    this._globalService.clienteAdmin('factura-cliente', this.datos).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Factura almacenada!',
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

  onInputPrecio() {
    let precio = this.datos.precio != "" ? Number.parseFloat(this.datos.precio) : 0;
    let precioExtraordinario = this.datos.precioExtraordinario != "" ? Number.parseFloat(this.datos.precioExtraordinario) : 0;
    let precioAdicional = this.datos.precioAdicional != "" ? Number.parseFloat(this.datos.precioAdicional) : 0;
    let subtotal = 0;

    if (this.datos.lugarID > 0) {
      var data = this.dataTable.filter((x: any) => x.lugarID == this.datos.lugarID)[0];     
      subtotal = precio + precioExtraordinario + precioAdicional;

      data.precio = precio;
      data.precioExtraordinario = precioExtraordinario;
      data.precioAdicional = precioAdicional;      
      data.subtotal = subtotal;
    }
  }

  onClick() {
    this.datos.total = 0;
    this.dataTable.forEach((data: any) => {
      let subtotalN = Number.parseFloat(data.subtotal);
      this.datos.total += subtotalN;
    });
  }

  private clearFields() {
    this.datos.precio = "";
    this.datos.precioExtraordinario = "";
    this.datos.precioAdicional = "";
  }

  onSelectMC() {
    this.clearFields();
  }

}
