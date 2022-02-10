import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-deudas-inquilino',
  templateUrl: './deudas-inquilino.component.html',
  styleUrls: ['./deudas-inquilino.component.css'],
  providers: [GlobalService]
})
export class DeudasInquilinoComponent implements OnInit {

  public datos: any;
  public periodos: any;

  public inquilinos: Model[];
  public inquilino: Model = { id: 0, nombre: '' };

  public isModify: boolean = false;

  formatter = (model: Model) => model.nombre;

  searchInquilino = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.inquilinos.filter(inquilino => new RegExp(term, 'mi').test(inquilino.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.inquilinos = new Array<Model>();

    this.datos = {
      inquilinoID: 0,
      deudaTotal: "",
      deudaPendiente: "",
      periodo: 0,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getInquilinos();
    this.getPeriodos();
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
    this.datos.inquilinoID = this.inquilino.id;

    if(this.isModify) {
      this._globalService.clienteAdmin('edit-inquilino-deuda', this.datos).subscribe(
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
      this._globalService.clienteAdmin('add-inquilino-deuda', this.datos).subscribe(
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
    if(this.inquilino != null && this.inquilino.id > 0) {
      this._globalService.getDataCxCId('inquilino-deudas', this.inquilino.id).subscribe(
        response => {
          if(response.status == "success") {
            var datos = response.data;
            this.datos = {
              inquilinoID: datos.inquilinoID,
              deudaTotal: datos.deuda_total,
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
