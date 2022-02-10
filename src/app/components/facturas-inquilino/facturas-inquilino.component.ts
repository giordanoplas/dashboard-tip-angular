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
  selector: 'app-facturas-inquilino',
  templateUrl: './facturas-inquilino.component.html',
  styleUrls: ['./facturas-inquilino.component.css'],
  providers: [GlobalService]
})
export class FacturasInquilinoComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  public _customHeader = Global.custom_header;
  public usuarios_por_pagina = Global.usuarios_por_pagina;
  public selectedDate: any;

  public facturasInquilino: any;
  public paginaActual: number = 1;
  public totalPaginas: number = 1;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;
  public isSearch: boolean = false;
  public facturaPrint: any;

  public peso: string = "RD$";
  public total: number = 0;
  public subtotal: number = 0;

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faSearch = faSearch;
  faPrint = faPrint;
  faTrash = faTrash;

  public inquilinos: Model[];
  public inquilino: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchInquilino = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.inquilinos.filter(inquilino => new RegExp(term, 'mi').test(inquilino.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.inquilinos = new Array<Model>();
    this.selectedDate = moment(Date.now()).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.getInquilinos();
  }

  getInquilinos() {
    this._globalService.getDataCxC('inquilinos').subscribe(
      response => {
        if (response.status == "success") {
          this.inquilinos = response.data;
        }
      },
      error => { }
    );
  }

  onBuscar() {
    if (this.inquilino != null && this.inquilino.id > 0) {
      this.getFacturasInquilino();
    } else {
      this.facturasInquilino = null;
      this.isSearch = false;
    }
  }

  private getFacturasInquilino() {
    this.facturasInquilino = null;
    
    this._globalService.searchCuentasLogDate('facturas-inquilino', this.inquilino.id, this.selectedDate).subscribe(
      response => {
        if (response.status == 'success') {
          this.isSearch = true;
          this.dataSearchEmpty = false;
          this.facturasInquilino = response.data;          
        } else {
          this.isSearch = false;
          this.facturasInquilino = null;
        }
      },
      error => { }
    );
  }

  public deleteFactura(id: number, facturaN: string) {
    if (id != null) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta factura, no podrás recuperarla y todos los datos relacionados a esta factura, serán eliminados...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          this._globalService.deleteFactura("delete-factura-inquilino", id, facturaN).subscribe(
            response => {
              if (response.status == 'success') {
                Swal.fire({
                  title: 'Factura eliminada!',
                  text: response.mensaje,
                  icon: 'success',
                  confirmButtonText: 'Cool...'
                }).then(() => {
                  this.getFacturasInquilino();
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
    this.facturaPrint = this.facturasInquilino.filter((x: any) => x.inquilinoID == id && x.facturaN == facturaN);
    this.total = 0;

    this.facturaPrint.forEach((x: any) => {
      let subtotal = Number.parseFloat(x.subtotal);
      this.total += subtotal;
    });

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
    this.getFacturasInquilino();
  }

  onInputBuscar() {
    if(this.inquilino != null && this.inquilino.id > 0) {
      this.getFacturasInquilino();
      this.dataSearchEmpty = this.facturasInquilino == null ? true : false;
    } else {
      this.dataSearchEmpty = true;
    }   
  }

}
