import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from "../../services/global";
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as moment from 'moment';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css'],
  providers: [GlobalService]
})
export class FacturarComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;

  public peso = "RD$";

  public inquilino: any;
  public datos: any;
  private isPrintF: boolean = false;
  public dataTable: any;
  public piso: number = 0;
  public division: number = 0;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.datos = {
      inquilinoID: 0,
      numero: "",
      precio: "",
      detalle: "",
      nota: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      vh: "",
      total: 0,
      itbis: 0,
      totalGeneral: 0,
      pisoDivision: ""
    }
  }

  ngOnInit(): void {    
    this.getInquilino();    
  }

  getInquilino() {
    this._route.params.subscribe((params) => {
      let inquilinoID = params.inquilinoID;
      let piso = params.piso;
      let division = params.division;

      if (inquilinoID != null && piso != null && division != null) {
        this.piso = piso;
        this.division = division;

        this._globalService.getDataCxCId('datos-inquilino', inquilinoID).subscribe(
          response => {
            if (response.status == 'success') {
              var datos = response.data; 
              this.dataTable = Array<any>();

              var facturas: any = null;
              var cuentas: any = null;
              var fechaActual: any = moment(Date.now()).format('YYYY-MM-DD');

              this.inquilino = {
                datos: datos,
                facturas,
                cuentas
              };  
              
              this.inquilino.datos.forEach((inq: any) => {
                this.dataTable.push(
                  { modulo: inq.descripcion_lugar, sp_se: inq.sp_se, precio: 0, metrosCuadrados: inq.metros_cuadrados, subtotal: 0,
                  piso: inq.piso, division: inq.division }
                );
              });         

              this.datos.inquilinoID = this.inquilino.datos[0].inquilinoID;
              this.datos.rnc = this.inquilino.datos[0].rnc;
              this.datos.ncf = this.inquilino.datos[0].ncf;
              this.datos.pisoDivision = "piso: " + piso + ", division: " + division;              

              this._globalService.searchCuentasLogDate('factura-inquilino-fecha', inquilinoID, fechaActual).subscribe(
                response => {   
                   
                  if(response.status == 'success') {
                    facturas = response.data;

                    this._globalService.getDataCxCId('cuenta-inquilino', inquilinoID).subscribe(
                      response => {
                        if(response.status == 'success') {
                          cuentas = response.data;                          

                          this.inquilino = {
                            datos: datos,
                            facturas,
                            cuentas
                          };       
                        } else {
                          this.inquilino = {
                            datos: datos,
                            facturas,
                            cuentas
                          };                        
                        }
                      },
                      error => {}
                    );
                  } else {
                    this.inquilino = {
                      datos: datos,
                      facturas,
                      cuentas
                    };
                  }
                },
                error => {}
              );     
              
              this._globalService.getDataCxC('factura-inquilino-ultimo-codigo').subscribe(
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
          error => {}
        );        
      } else {
        this._router.navigate(['/'])
          .then(() => {
            location.reload();
          });
      }
    });
  }

  private facturaInquilino(data: any) {
    this._globalService.clienteAdmin('factura-inquilino', data).subscribe(
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

  onSubmit() {
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

    let index = 0;
    this.dataTable.forEach((dt: any) => {
      var data = {
        inquilinoID: this.inquilino.datos[index].inquilinoID,
        lugarID: this.inquilino.datos[index].lugarID,
        numero: this.datos.numero,
        piso: this.inquilino.datos[index].piso,
        division: this.inquilino.datos[index].division,
        precio: dt.precio,
        metrosCuadrados: dt.metrosCuadrados,
        detalle: this.datos.detalle,
        nota: this.datos.nota,
        fecha: this.datos.fecha,
        vh: this.datos.vh
      }
      this.facturaInquilino(data); 
      index++;
    });
  }

  onInputPrecio(event: any) {
    let precio = event.target.value;
    if (precio != null) {
      let precioN = Number.parseFloat(precio);
      var data = this.dataTable.filter((x: any) => x.piso == this.piso && x.division == this.division)[0];
      let metrosCuadrados = Number.parseInt(data.metrosCuadrados);
      let subtotal = precioN * metrosCuadrados;
      
      data.precio = precio;
      data.subtotal = subtotal;
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
      this.datos.rnc = this.inquilino[0].rnc;
      this.datos.ncf = this.inquilino[0].ncf;
    } else {
      this.datos.rnc = "";
      this.datos.ncf = "";
    }
  }

  onSelectMC() {
    let piso = Number.parseInt(this.datos.pisoDivision.split(", ")[0].substring(6));
    let division = Number.parseInt(this.datos.pisoDivision.split(", ")[1].substring(9));

    this.piso = piso;
    this.division = division;

    this.clearFields();
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
  }

}
