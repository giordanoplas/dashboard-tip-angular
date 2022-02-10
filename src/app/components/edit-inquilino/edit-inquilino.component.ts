import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-edit-inquilino',
  templateUrl: './edit-inquilino.component.html',
  styleUrls: ['./edit-inquilino.component.css'],
  providers: [GlobalService]
})
export class EditInquilinoComponent implements OnInit {

  public datos: any;

  public inquilinos: Model[];
  public inquilino: any;

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
      id: 0,
      nombre: "",
      telefono1: "",
      telefono2: "",
      telefono3: "",
      direccion: "",
      email: "",
      rnc: "",
      ncf: ""
    }
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

  onSubmit() {
    this._globalService.clienteAdmin('edit-inquilino', this.datos).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Inquilino modificado!',
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
    if (this.inquilino != null && this.inquilino.id > 0) {
      this._globalService.getDataCxCId('inquilino', this.inquilino.id).subscribe(
        response => {
          if (response.status == "success") {
            var data = response.data;
            this.datos = {
              id: data.id,
              nombre: data.nombre,
              telefono1: data.telefono1,
              telefono2: data.telefono2,
              telefono3: data.telefono3,
              direccion: data.direccion,
              email: data.email,
              rnc: data.rnc,
              ncf: data.ncf
            }
          } else {
            this.datos = {
              id: 0,
              nombre: "",
              telefono1: "",
              telefono2: "",
              telefono3: "",
              direccion: "",
              email: "",
              descripcion: ""
            }
          }
        },
        error => { }
      );
    }
  }

  validarEmail() {
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(this.datos.email);
  }

  validarTelefono(telefono: string) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(telefono);
  }

}
