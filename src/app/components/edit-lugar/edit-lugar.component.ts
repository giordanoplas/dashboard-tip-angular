import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-edit-lugar',
  templateUrl: './edit-lugar.component.html',
  styleUrls: ['./edit-lugar.component.css'],
  providers: [GlobalService]
})
export class EditLugarComponent implements OnInit {

  public datos: any;

  public lugares: Model[];

  public lugar: any;
  public lugarTipos: any;

  formatter = (model: Model) => model.nombre;

  searchLugar = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.lugares.filter(lugar => new RegExp(term, 'mi').test(lugar.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.lugares = new Array<Model>();
    this.datos = {
      id: 0,
      nombre: "",
      lugarTipoID: 0,
      cantPisos: 1,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getLugarTipos();
    this.getLugares();
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

  getLugarTipos() {
    this._globalService.getDataCxC('lugar-tipos').subscribe(
      response => {
        if (response.status == "success") {
          this.lugarTipos = response.data;
        } else {
          this.lugarTipos = null;
        }
      },
      error => { }
    );
  }

  onSubmit() {
    this._globalService.clienteAdmin('edit-lugar', this.datos).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Lugar modificado!',
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
          text: "Ha ocurrido un error inesperado. Asegúrate de no usar signos como '#' en los campos",
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  setDatos() {
    if (this.lugar != null && this.lugar.id > 0) {
      this._globalService.getDataCxCId('lugar', this.lugar.id).subscribe(
        response => {
          if (response.status == "success") {
            var data = response.data;
            this.datos = {
              id: data.id,
              nombre: data.nombre,
              lugarTipoID: data.lugar_tipoID,
              cantPisos: data.cant_pisos,
              descripcion: data.descripcion
            };
          } else {
            this.datos = {
              id: 0,
              nombre: "",
              lugarTipoID: 0,
              cantPisos: 1,
              descripcion: ""
            }
          }
        },
        error => { }
      );
    }
  }

}
