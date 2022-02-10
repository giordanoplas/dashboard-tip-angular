import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string, cant_pisos: number };

@Component({
  selector: 'app-divisiones-piso-lugar',
  templateUrl: './divisiones-piso-lugar.component.html',
  styleUrls: ['./divisiones-piso-lugar.component.css'],
  providers: [GlobalService]
})
export class DivisionesPisoLugarComponent implements OnInit {

  public datos: any;
  public lugares: Model[];
  public modulosValue: Array<any> = [];

  public isError: boolean = false;
  public errorMsn: string = '';
  public lugar: Model = { id: 0, nombre: '', cant_pisos: 0 };

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
      lugarID: 0,
      divisiones: [],
      descripcion: ""
    }
  }

  ngOnInit(): void {
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

  private clearFields() {
    this.lugar = { id: 0, nombre: '', cant_pisos: 0 };
    this.datos = {
      lugarID: 0,
      divisiones: [],
      descripcion: ""
    }
  }

  onSubmit() {
    if (this.lugar != null) {
      if (this.lugar.id > 0) {
        this.datos.lugarID = this.lugar.id;
        let cantPisos = this.lugares.filter(x => x.id === this.datos.lugarID)[0].cant_pisos;
        var pisosDoc = document.getElementsByName("piso");
        var pisosVal = Array<number>();
        pisosDoc.forEach(val => {
          var v = <HTMLInputElement>val;
          if (v.value.length > 0) {
            pisosVal.push(Number.parseInt(v.value));
          }
        });

        if (cantPisos == pisosVal.length) {
          this.datos.divisiones = pisosVal;

          if (this.modulosValue.length == 0) {
            this._globalService.clienteAdmin('add-divisiones-pisos-lugar', this.datos).subscribe(
              response => {
                if (response.status == "success") {
                  Swal.fire({
                    title: 'Módulos creados',
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
            this._globalService.clienteAdmin('edit-divisiones-pisos-lugar', this.datos).subscribe(
              response => {
                if (response.status == "success") {
                  Swal.fire({
                    title: 'Módulos modificados',
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
          }
        } else {
          this.errorMsn = 'Debes poner la cantidad de módulos para cada uno de los ' + cantPisos + ' pisos...';
          this.isError = true;
        }
      } else {
        this.errorMsn = 'Debes seleccionar un lugar válido...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un lugar válido...';
      this.isError = true;
    }
  }

  createRangeLugar(lugarID: number) {
    let number = this.lugares.filter(x => x.id === lugarID)[0].cant_pisos;
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }

    return items;
  }

  onChangeLugar() {
    if (this.lugar != null && this.lugar.id > 0) {
      this._globalService.getDataCxCId('pisos-divisiones-lugar', this.lugar.id).subscribe(
        response => {
          if (response.status == 'success') {
            var data = response.data;
            this.modulosValue = data;
            this.datos.descripcion = data[0].descripcion;
          } else {
            this.modulosValue = [];
            this.datos.descripcion = "";
          }
        },
        error => { }
      );
    }
  }
}
