import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from 'moment';

const DATE_FORMAT = 'MM';

@Component({
  selector: 'app-cuentas-por-cobrar-single',
  templateUrl: './cuentas-por-cobrar-single.component.html',
  styleUrls: ['./cuentas-por-cobrar-single.component.css'],
  providers: [GlobalService]
})
export class CuentasPorCobrarSingleComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;

  public cliente: any;
  public data: any;
  public dataInfo: any;
  private indexArg: number = 0;
  private lugarArg: string = "";

  faCircle = faCircle;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getCliente();
  }

  getCliente() {
    this._route.params.subscribe((params) => {
      let clienteID = params.clienteID;
      if(clienteID != null) {
        this._globalService.getDataCxCId("datos-cliente", clienteID).subscribe(
          response => {
            if(response.status == "success") {
              var nombre = response.data[0].cliente;              
              var data = response.data;

              this._globalService.getDataCxCId('lugar-pisos-divisiones', clienteID).subscribe(
                response => {
                  if(response.status == 'success') {     
                    let pisosDivisiones = response.data;                    
                    this.cliente = { cliente: nombre, data, pisosDivisiones };
                  } else {
                    this.cliente = { cliente: nombre, data, 'pisosDivisiones': null };                    
                  }
                },
                error => {}
              );              
            } else {
              this.cliente = null;
            }
          },
          error => {}
        );
      }
    });    
  }

  getLugarDataInfo(piso: number, division: number) {
    var data = this.cliente.data.filter((x: any) => x.piso == piso && x.division == division)[0];

    if(data != null) {
      let deudaTotal = data.deuda_total;       

      if(deudaTotal != null) {
        if(data.pago != null) {
          let pago = data.pago;
          let pagoAdelantado = data.pago_adelantado;
          let mesActual = Number.parseInt(moment(Date.now()).format(DATE_FORMAT));
          let mesUltPago = Number.parseInt(moment(data.fecha_ultimo_pago).format(DATE_FORMAT));
          let alDia = false;
          if(mesActual === mesUltPago && pagoAdelantado === 0) {
            alDia = true;
          } else if(mesActual >= mesUltPago && pagoAdelantado > 0) {
            let pa = pagoAdelantado+mesUltPago;
            if(pa <= 12) {
              alDia = pa >= mesActual ? true : false;
            } else {
              alDia = false;
            }
          } else {
            alDia = false;
          }
          let pagadoCompleto = pago < deudaTotal ? false : true;   
          let pagadoIncompleto = pago > 0 && pago < deudaTotal ? true : false;     
  
          if(alDia && pagadoCompleto) {
            data.deuda_pendiente = 0;
          } else if(alDia && pagadoIncompleto) {
            data.deuda_pendiente = deudaTotal-pago;
          } else {
            data.deuda_pendiente = deudaTotal;
          }
        } else {
          data.deuda_pendiente = deudaTotal;
        }
      } else {
        data.deuda_total = 0
        data.deuda_pendiente = 0;
      }      
    }   

    return data;


/*

    var data = this.cliente.data.filter((x: any) => x.piso == piso && x.division == division)[0];

    if(data != null) {
      let deudaTotal = data.deuda_total;       

      if(data.pago != null) {
        let pago = data.pago;
        let pagoAdelantado = data.pago_adelantado;
        let mesActual = Number.parseInt(moment(Date.now()).format(DATE_FORMAT));
        let mesUltPago = Number.parseInt(moment(data.fecha_ultimo_pago).format(DATE_FORMAT));
        let alDia = false;
        if(mesActual === mesUltPago && pagoAdelantado === 0) {
          alDia = true;
        } else if(mesActual >= mesUltPago && pagoAdelantado > 0) {
          let pa = pagoAdelantado+mesUltPago;
          if(pa <= 12) {
            alDia = pa >= mesActual ? true : false;
          } else {
            alDia = false;
          }
        } else {
          alDia = false;
        }
        let pagadoCompleto = pago < deudaTotal ? false : true;   
        let pagadoIncompleto = pago > 0 && pago < deudaTotal ? true : false;     

        if(alDia && pagadoCompleto) {
          data.deuda_pendiente = 0;
        } else if(alDia && pagadoIncompleto) {
          data.deuda_pendiente = deudaTotal-pago;
        } else {
          data.deuda_pendiente = deudaTotal;
        }
      } else {
        data.deuda_pendiente = deudaTotal;
      }
    } 

    /*
    if(data != null) {
      let deudaTotal = data.deuda_total;       

      if(data.pago != null) {
        let pago = data.pago;
        let pagoAdelantado = data.pago_adelantado;
        let mesActual = Number.parseInt(moment(Date.now()).format(DATE_FORMAT));
        let mesUltPago = Number.parseInt(moment(data.fecha_ultimo_pago).format(DATE_FORMAT));
        let alDia = false;
        if(mesActual === mesUltPago && pagoAdelantado === 0) {
          alDia = true;
        } else if(mesActual >= mesUltPago && pagoAdelantado > 0) {
          let pa = pagoAdelantado+mesUltPago;
          if(pa <= 12) {
            alDia = pa >= mesActual ? true : false;
          } else {
            alDia = false;
          }
        } else {
          alDia = false;
        }
        let pagado = pago < deudaTotal ? false : true;        

        if(alDia && pagado) {
          data.deuda_pendiente = 0;
        } else {
          data.deuda_pendiente = deudaTotal;
        }
      } else {
        data.deuda_pendiente = deudaTotal;
      }
    }   
    

    return data;*/
  }

  goFacturarInquilino(id: number, piso: number, division: number) {
    this._router.navigate(['/facturar-inquilino', id, piso, division])
      .then(() => {
        this.closeModal();
      });
  }

  goReciboInquilino(id: number, piso: number, division: number) {
    this._router.navigate(['/recibo-inquilino', id, piso, division])
      .then(() => {
        this.closeModal();
      });
  }

  goFacturarCliente(id: number) {
    this._router.navigate(['/facturar-cliente', id])
      .then(() => {
        this.closeModal();
      });
  }

  goReciboCliente(id: number) {
    this._router.navigate(['/recibo-cliente', id])
      .then(() => {
        this.closeModal();
      });
  }

  dataModal(data: any, content: any) {
    this._modalService.open(content, { ariaLabelledBy: content, windowClass: 'modal-badge', centered: true, size: 'md' });
    this.data = data;
  }  

  closeModal() {
    if (this._modalService.hasOpenModals()) {
      this._modalService.dismissAll();
    }
  }

  setIndexArg(lugar: string, index: number) {
    if(index === 0) {
      this.indexArg = 0;
    } else if(this.indexArg === 0 && lugar !== this.lugarArg) {
      this.lugarArg = lugar;
      this.indexArg++;      
    } else if(this.indexArg > 0 && lugar !== this.lugarArg) {
      this.indexArg = 0;
    } else {
      this.lugarArg = lugar
    }

    return this.indexArg;
  }

  createRange(number: number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

}
