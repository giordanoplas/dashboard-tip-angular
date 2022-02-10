import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faAngleDoubleLeft, faAngleDoubleRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

const DATE_FORMAT = 'MM';

@Component({
  selector: 'app-view-cxc',
  templateUrl: './view-cxc.component.html',
  styleUrls: ['./view-cxc.component.css'],
  providers: [GlobalService]
})
export class ViewCxcComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;
  public propiedades_por_pagina = Global.propiedades_por_pagina;

  public isSearch: boolean = false;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;

  public cxc: any;
  public clientesP: any;
  public lugaresPisosDivisiones: any;
  public data: any;
  public dataInfo: any;
  private indexArg: number = 0;
  private lugarArg: string = "";
  
  public paginaActual: number = 1;
  public totalPaginas: number = 1;  

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faCircle = faCircle;
  faSearch = faSearch;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {   
    this.paginacion();
    this.getCXC();    
  }

  private getCXC() {    
    this._globalService.getDataCxC('datos-clientes').subscribe(
      response => {
        if(response.status == 'success') {
          let clientes = response.data;
          let cxc = Array<any>();
          this.clientesP = Array<any>();
          
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.propiedades_por_pagina - this.propiedades_por_pagina : 0;
          let fin = (inicio + this.propiedades_por_pagina);
          this.totalPaginas = Math.ceil(clientes.length / this.propiedades_por_pagina);

          this.clientesP = clientes.slice(inicio, fin);    
          this.clientesP.forEach((cliente: any) => {
            this._globalService.getDataCxCId('datos-cliente', cliente.id).subscribe(
              response => {
                if(response.status == 'success') {
                  let nombre = cliente.nombre;
                  let data = response.data;
                  
                  this._globalService.getDataCxCId('lugar-pisos-divisiones', cliente.id).subscribe(
                    response => {
                      if(response.status == 'success') {     
                        let pisosDivisiones = response.data;

                        cxc.push(
                          { cliente: nombre, data, pisosDivisiones }
                        )
                      } else {
                        cxc.push(
                          { cliente: nombre, data, 'pisosDivisiones': null }
                        )
                      }
                    },
                    error => {}
                  );                  
                }
              },
              error => {}
            )
          });
          this.cxc = cxc;      
        } else {
          this.clientesP = null;
        }
      },
      error => {}
    );
  } 

  getLugarDataInfo(clienteID: number, piso: number, division: number) {
    var data = this.cxc.filter((x: any) => x.data[0].clienteID == clienteID)[0].data;
    var data2 = data.filter((y: any) => y.piso == piso && y.division == division)[0];

    if(data2 != null) {
      let deudaTotal = data2.deuda_total;       

      if(deudaTotal != null) {
        if(data2.pago != null) {
          let pago = data2.pago;
          let pagoAdelantado = data2.pago_adelantado;
          let mesActual = Number.parseInt(moment(Date.now()).format(DATE_FORMAT));
          let mesUltPago = Number.parseInt(moment(data2.fecha_ultimo_pago).format(DATE_FORMAT));
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
            data2.deuda_pendiente = 0;
          } else if(alDia && pagadoIncompleto) {
            data2.deuda_pendiente = deudaTotal-pago;
          } else {
            data2.deuda_pendiente = deudaTotal;
          }
        } else {
          data2.deuda_pendiente = deudaTotal;
        }
      } else {
        data2.deuda_total = 0
        data2.deuda_pendiente = 0;
      }      
    }   

    return data2;
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
    if(this.isSearch) {
      this._router.navigate(['/cxc', param]).then(() => {
        this.search();
      });
    } else {
      this._router.navigate(['/cxc', param]).then(() => {              
        this.getCXC();
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

  private search() {
    if(this.nombreSearch.length > 0) {
      this._globalService.searchClientes('search-clientes-nombre', this.nombreSearch).subscribe(
        response => {
          if(response.status == 'success') {
            this.isSearch = true;
            this.dataSearchEmpty = false;

            let clientes = response.data;
            let cxc = Array<any>();
  
            this.clientesP = clientes;          
            this.clientesP.forEach((cliente: any) => {
              this._globalService.getDataCxCId('datos-cliente', cliente.id).subscribe(
                response => {
                  if(response.status == 'success') {
                    let nombre = cliente.nombre;
                    let data = response.data;
                    
                    this._globalService.getDataCxCId('lugar-pisos-divisiones', cliente.id).subscribe(
                      response => {
                        if(response.status == 'success') {     
                          let pisosDivisiones = response.data;
  
                          cxc.push(
                            { cliente: nombre, data, pisosDivisiones }
                          )
                        } else {
                          cxc.push(
                            { nombre, data, 'pisosDivisiones': null }
                          )
                        }
                      },
                      error => {}
                    );                  
                  }
                },
                error => {}
              )
            });
  
            this.cxc = cxc;           
          } else {
            this.isSearch = false;
            this.dataSearchEmpty = true;
            this.clientesP = null;
          }
        },
        error => {}
      );
    } else {
      this.isSearch = false;
      this.getCXC();
    }
  }

  onBuscar() {
    this.search();
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
}
