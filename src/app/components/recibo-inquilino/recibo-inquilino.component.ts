import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from "../../services/global";
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as moment from 'moment';

@Component({
  selector: 'app-recibo-inquilino',
  templateUrl: './recibo-inquilino.component.html',
  styleUrls: ['./recibo-inquilino.component.css'],
  providers: [GlobalService]
})
export class ReciboInquilinoComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;

  public peso = "RD$";
  public facturaMsn: string = "";

  public inquilino: any;
  public datos: any;
  private isPrintF: boolean = false;

  public facturaStr: string = "";
  public isFactura: boolean = false;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.datos = {
      inquilinoID: 0,
      facturaN: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      pago: "",
      pago_adelantado: "",
      rnc: "",
      ncf: "",
      fecha_ultimo_pago: "",
      detalle: "",
      deudaTotal: 0
    }
  }

  ngOnInit(): void {
    this.getInquilino();
  }

  getInquilino() {
    this._route.params.subscribe((params) => {
      let inquilinoID = params.inquilinoID;
      if (inquilinoID != null && inquilinoID > 0) {
        this._globalService.getDataCxCId('datos-inquilino', inquilinoID).subscribe(
          response => {
            if (response.status == 'success') {
              var datos = response.data; 

              var facturas: any = null;
              var cuentas: any = null;
              var fechaActual: any = moment(Date.now()).format('YYYY-MM-DD');

              this.inquilino = {
                datos: datos[0],
                facturas,
                cuentas
              };    

              this.datos.inquilinoID = this.inquilino.datos.inquilinoID;
              this.datos.rnc = this.inquilino.datos.rnc;
              this.datos.ncf = this.inquilino.datos.ncf;

              this._globalService.searchCuentasLogDate('factura-inquilino-fecha', inquilinoID, fechaActual).subscribe(
                response => {
                  if(response.status == 'success') {
                    facturas = response.data;

                    let fechaActual = moment(Date.now()).format('YYYY-MM');
                    let fechaFilterS = fechaActual + "-00";
                    let fechaFilterE = fechaActual + "-32";

                    var deudaMes = facturas.filter((x: any) => x.fecha_factura > fechaFilterS && x.fecha_factura < fechaFilterE);
                    console.log(deudaMes);

                    deudaMes.forEach((x: any) => {
                      let precio = Number.parseFloat(x.precio_metro_cuadrado);
                      let metrosCuadrados = Number.parseFloat(x.metros_cuadrados);
                      let deuda = precio * metrosCuadrados;

                      this.datos.deudaTotal += deuda;
                    });

                    this._globalService.getDataCxCId('cuenta-inquilino', inquilinoID).subscribe(
                      response => {
                        if(response.status == 'success') {
                          cuentas = response.data;                          
                          this.datos.fecha_ultimo_pago = cuentas[0].fecha_ultimo_pago;

                          this.inquilino = {
                            datos: datos[0],
                            facturas,
                            cuentas
                          };                        
                        } else {
                          this.inquilino = {
                            datos: datos[0],
                            facturas,
                            cuentas
                          };
                        }
                      },
                      error => {}
                    );
                  } else {
                    this.inquilino = {
                      datos: datos[0],
                      facturas,
                      cuentas
                    };
                  }
                },
                error => {}
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
    if(this.isFactura) {
      if (this.isPrintF) {
        var printF = document.getElementById("print_f_html");
        printF?.classList.remove("d-none");
        printJS({
          printable: "print_f_html",
          type: 'html',
          targetStyles: ['*']
        });
        printF?.classList.add("d-none");
      }
  
      this._globalService.clienteAdmin('pago-inquilino', this.datos).subscribe(
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

  onInputFactura(event: any) {
    var value = event.target.value;
    if (value != null && value.length > 5) {
      this._globalService.getFacturaCxC('factura-numero', value).subscribe(
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

  onPrintCheckedRNC(event: any) {
    let checked = event.target.checked;

    if (checked) {
      this.datos.rnc = this.inquilino[0].rnc;
      this.datos.ncf = this.inquilino[0].ncf;
    } else {
      this.datos.rnc = "";
      this.datos.ncf = "";
    }
  }

  onClickPagoAdelantado() {
    if (this.datos.pago != "" && this.datos.pago_adelantado != "") {
      let pago = Number.parseInt(this.datos.pago);
      let pago_adelantado = Number.parseInt(this.datos.pago_adelantado);

      if (pago_adelantado > 0) {
        this.datos.pago = pago * pago_adelantado;
      }
    }
  }

}
