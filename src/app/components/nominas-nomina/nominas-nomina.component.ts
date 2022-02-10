import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-nominas-nomina',
  templateUrl: './nominas-nomina.component.html',
  styleUrls: ['./nominas-nomina.component.css'],
  providers: [GlobalService]
})
export class NominasNominaComponent implements OnInit {

  public datos: any;

  public empleados: Model[];
  public clientes: Model[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public empleado: Model = { id: 0, nombre: '' };
  public cliente: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchEmpleado = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.empleados.filter(empleado => new RegExp(term, 'mi').test(empleado.nombre)).slice(0, 10))
  );

  searchCliente = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.clientes.filter(cliente => new RegExp(term, 'mi').test(cliente.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.empleados = new Array<Model>();
    this.clientes = new Array<Model>();

    this.datos = {
      empleadoID: 0,
      clienteID: 0,
      sueldo: "",
      posicion: "",
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getEmpleados();
    this.getClientes();
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

  private clearFields() {
    this.empleado = { id: 0, nombre: '' };
    this.cliente = { id: 0, nombre: '' };
    this.datos = {
      empleadoID: 0,
      clienteID: 0,
      sueldo: "",
      posicion: "",
      descripcion: ""
    }
  }

  asignar() {
    if (this.empleado != null && this.cliente != null) {
      if (this.empleado.id > 0 && this.cliente.id > 0) {
        this.datos.empleadoID = this.empleado.id;
        this.datos.clienteID = this.cliente.id;

        this._globalService.clienteAdmin('add-nomina-empleado', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Datos introducidos en la nómina satisfactoriamente!!!',
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
      } else {
        this.errorMsn = 'Debes seleccionar un empleado y cliente...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un empleado y cliente...';
      this.isError = true;
    }
  }  

  quitar() {
    if (this.empleado != null && this.cliente != null) {
      if (this.empleado.id > 0 && this.cliente.id > 0) {
        this.datos.empleadoID = this.empleado.id;
        this.datos.clienteID = this.cliente.id;

        this._globalService.clienteAdmin('delete-nomina-empleado', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Datos quitados satisfactoriamente!!!',
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
      } else {
        this.errorMsn = 'Debes seleccionar un empleado y cliente...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un empleado y cliente...';
      this.isError = true;
    }
  }

}
