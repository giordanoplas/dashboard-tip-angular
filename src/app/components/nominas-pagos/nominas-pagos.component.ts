import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, throwIfEmpty } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as moment from 'moment';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-nominas-pagos',
  templateUrl: './nominas-pagos.component.html',
  styleUrls: ['./nominas-pagos.component.css'],
  providers: [GlobalService]
})
export class NominasPagosComponent implements OnInit {

  public _ruta = Global.ruta;
  public _dataurl = Global.dataurl;
  private isPrintF: boolean = false;
  public peso: string = "RD$";

  public datos: any;

  public empleados: Model[];
  public cliente: any;

  public isError: boolean = false;
  public errorMsn: string = '';

  public empleado: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchEmpleado = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.empleados.filter(empleado => new RegExp(term, 'mi').test(empleado.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.empleados = new Array<Model>();

    this.datos = {
      empleadoID: 0,
      pago: "",
      tss: "",
      detalle: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      total: 0
    }
  }

  ngOnInit(): void {
    this.getEmpleados();
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

  getClienteEmpleado() {
    this._globalService.getDataCxCId('cliente-empleado', this.empleado.id).subscribe(
      response => {
        if (response.status == "success") {
          this.cliente = response.data;
        }
      },
      error => { }
    );
  }

  private clearFields() {
    this.empleado = { id: 0, nombre: '' };
    this.datos = {
      empleadoID: 0,
      pago: "",
      tss: "",
      detalle: "",
      fecha: moment(Date.now()).format('YYYY-MM-DD'),
      total: 0
    }
  }

  private pagoEmpleado() {
    this.datos.empleadoID = this.empleado.id;

    this._globalService.clienteAdmin('add-pago-empleado', this.datos).subscribe(
      response => {
        if (response.status == "success") {
          Swal.fire({
            title: 'Datos introducidos satisfactoriamente!!!',
            text: response.mensaje,
            icon: 'success',
            confirmButtonText: 'Cool...'
          }).then(() => {
            this.clearFields();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje,
            icon: 'error',
            confirmButtonText: 'Ok!'
          });
        }
      },
      error => {}
    );
  }

  onSubmit() {
    if (this.empleado != null && this.empleado.id > 0) {
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

      this.pagoEmpleado();
    } else {
      this.errorMsn = 'Debes seleccionar un empleado...';
      this.isError = true;
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

  onInputPagos() {
    let pago = this.datos.pago != null && this.datos.pago != "" ? Number.parseFloat(this.datos.pago) : 0;
    let tss = this.datos.tss != null && this.datos.tss != "" ? Number.parseFloat(this.datos.tss) : 0;
    this.datos.total = pago + tss;
  }

}
