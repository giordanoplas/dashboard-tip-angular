import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };
type Model2 = { id: number, nombre: string, cant_pisos: number };
type Model3 = { lugarID: number, lugar: string, piso: number, cant_divisiones: number };

@Component({
  selector: 'app-lugar-inquilino',
  templateUrl: './lugar-inquilino.component.html',
  styleUrls: ['./lugar-inquilino.component.css'],
  providers: [GlobalService]
})
export class LugarInquilinoComponent implements OnInit {

  public datos: any;
  public divisionesPisoLugar: Model3[];
  public cantDivisionesPiso: number = 0;

  public inquilinos: Model[];
  public lugares: Model2[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public inquilino: Model = { id: 0, nombre: '' };
  public lugar: Model2 = { id: 0, nombre: '', cant_pisos: 0 };

  formatter = (model: Model) => model.nombre;
  formatter2 = (model: Model2) => model.nombre;

  searchInquilino = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.inquilinos.filter(inquilino => new RegExp(term, 'mi').test(inquilino.nombre)).slice(0, 10))
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
    this.inquilinos = new Array<Model>();
    this.lugares = new Array<Model2>();
    this.divisionesPisoLugar = new Array<Model3>();

    this.datos = {
      inquilinoID: 0,
      lugarID: 0,
      piso: 0,
      division: 0,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getDivisionesPisoLugar();
    this.getInquilinos();
    this.getLugares();
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

  getDivisionesPisoLugar() {
    if(this.lugar != null && this.lugar.id != 0) {
      this._globalService.getDataCxCId('divisiones-piso-lugar', this.lugar.id).subscribe(
        response => {
          if(response.status == "success") {
            this.divisionesPisoLugar = response.data;
          }
        },
        error => {}
      );
    }
  }

  private clearFields() {
    this.inquilino = { id: 0, nombre: '' };
    this.lugar = { id: 0, nombre: '', cant_pisos: 0 };
    this.datos = {
      inquilinoID: 0,
      lugarID: 0,
      piso: 0,
      division: 0,
      sp_se: "",
      metrosCuadrados: "",
      descripcion: ""
    }
  }

  asignar() {
    if (this.inquilino != null && this.lugar != null) {
      if (this.inquilino.id > 0 && this.lugar.id > 0 && this.datos.piso > 0 && this.datos.division > 0) {
        this.datos.inquilinoID = this.inquilino.id;
        this.datos.lugarID = this.lugar.id;

        this._globalService.clienteAdmin('asignar-division-inquilino', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Módulo asignado a inquilino',
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
        this.errorMsn = 'Debes seleccionar el inquilino, lugar, piso y módulo...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar el inquilino, lugar, piso y módulo...';
      this.isError = true;
    }
  }

  quitar() {
    if (this.inquilino != null && this.lugar != null) {
      if (this.inquilino.id > 0 && this.lugar.id > 0) {
        this.datos.inquilinoID = this.inquilino.id;
        this.datos.lugarID = this.lugar.id;

        this._globalService.clienteAdmin('quitar-division-inquilino', this.datos).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Lugar quitado de inquilino',
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
        this.errorMsn = 'Debes seleccionar un inquilino y lugar válidos...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un inquilino y lugar válidos...';
      this.isError = true;
    }
  }

  createRange(number: number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  } 

  onChangePisos(event: any) {
    let piso = Number.parseInt(event.target.value);
    this.cantDivisionesPiso = this.divisionesPisoLugar.filter(x => x.piso === piso)[0].cant_divisiones;
  }

}
