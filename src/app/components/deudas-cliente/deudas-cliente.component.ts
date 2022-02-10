import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-deudas-cliente',
  templateUrl: './deudas-cliente.component.html',
  styleUrls: ['./deudas-cliente.component.css'],
  providers: [GlobalService]
})
export class DeudasClienteComponent implements OnInit {

  public datos: any;
  public periodos: any;

  public clientes: Model[];
  public cliente: Model = { id: 0, nombre: '' };

  public isModify: boolean = false;

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

    this.datos = {
      clienteID: 0,
      deudaTotal: "",
      pagoExtraordinario: "",
      pagoAdicional: "",
      periodo: 0,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getClientes();
    this.getPeriodos();
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

  getPeriodos() {
    this._globalService.getDataCxC('periodos-deudas').subscribe(
      response => {
        if (response.status == "success") {
          this.periodos = response.data;
        }
      },
      error => { }
    );
  }

  onSubmit() {
    this.datos.clienteID = this.cliente.id;

    if(this.isModify) {
      this._globalService.clienteAdmin('edit-cliente-deuda', this.datos).subscribe(
        response => {
          if(response.status == 'success') {
            Swal.fire({
              title: 'Deuda modificada!',
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
            text: "Ha ocurrido un error inesperado.",
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );      
    } else {
      this._globalService.clienteAdmin('add-cliente-deuda', this.datos).subscribe(
        response => {
          if(response.status == 'success') {
            Swal.fire({
              title: 'Deuda creada!',
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
            text: "Ha ocurrido un error inesperado.",
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
    }
  }

  updateOrModify() {
    if(this.cliente != null && this.cliente.id > 0) {
      this._globalService.getDataCxCId('cliente-deudas', this.cliente.id).subscribe(
        response => {
          if(response.status == "success") {
            var datos = response.data;
            this.datos = {
              clienteID: datos.clienteID,
              deudaTotal: datos.deuda_total,
              pagoExtraordinario: datos.pago_extraordinario,
              pagoAdicional: datos.pago_adicional,
              periodo: datos.periodo_deudaID,
              descripcion: datos.descripcion
            };
            this.isModify = true;            
          } else {
            this.isModify = false;
          }
        },
        error => {}
      );
    }
  }

}
