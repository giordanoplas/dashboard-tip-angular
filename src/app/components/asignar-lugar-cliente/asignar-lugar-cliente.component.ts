import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-asignar-lugar-cliente',
  templateUrl: './asignar-lugar-cliente.component.html',
  styleUrls: ['./asignar-lugar-cliente.component.css'],
  providers: [GlobalService]
})
export class AsignarLugarClienteComponent implements OnInit {

  public datos: any;

  public clientes: Model[];
  public lugares: Model[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public cliente: Model = { id: 0, nombre: '' };
  public lugar: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchCliente = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.clientes.filter(cliente => new RegExp(term, 'mi').test(cliente.nombre)).slice(0, 10))
  );

  searchLugar = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.lugares.filter(lugar => new RegExp(term, 'mi').test(lugar.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.clientes = new Array<Model>();
    this.lugares = new Array<Model>();
    this.datos = {
      clienteID: 0,
      lugarID: 0,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getClientes();
    this.getLugares();
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
    this._globalService.getDataCxC('lugares').subscribe(
      response => {
        if (response.status == "success") {
          this.lugares = response.data;
        }
      },
      error => { }
    );
  }

  private clearFields() {
    this.cliente = { id: 0, nombre: '' };
    this.lugar = { id: 0, nombre: '' };
    this.datos = {
      clienteID: 0,
      lugarID: 0,
      descripcion: ""
    }
  }

  asignar() {
    if (this.cliente != null && this.lugar != null) {
      if (this.cliente.id > 0 && this.lugar.id > 0) {
        this.datos.clienteID = this.cliente.id;
        this.datos.lugarID = this.lugar.id;

        this._globalService.clienteAdmin('asignar-lugar-cliente', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Lugar asignado a cliente',
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
          error => { }
        );
      } else {
        this.errorMsn = 'Debes seleccionar un cliente y lugar válidos...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un cliente y lugar válidos...';
      this.isError = true;
    }
  }

  quitar() {
    if (this.cliente != null && this.lugar != null) {
      if (this.cliente.id > 0 && this.lugar.id > 0) {
        this.datos.clienteID = this.cliente.id;
        this.datos.lugarID = this.lugar.id;

        this._globalService.clienteAdmin('quitar-lugar-cliente', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Lugar quitado de cliente',
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
          error => { }
        );
      } else {
        this.errorMsn = 'Debes seleccionar un cliente y lugar válidos...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un cliente y lugar válidos...';
      this.isError = true;
    }
  }
}
