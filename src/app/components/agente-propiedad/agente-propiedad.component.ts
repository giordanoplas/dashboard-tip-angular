import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-agente-propiedad',
  templateUrl: './agente-propiedad.component.html',
  styleUrls: ['./agente-propiedad.component.css'],
  providers: [GlobalService]
})
export class AgentePropiedadComponent implements OnInit {

  public agentes: Model[];
  public propiedades: Model[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public agente: Model = { id: 0, nombre: '' };
  public propiedad: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchAge = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.agentes.filter(agente => new RegExp(term, 'mi').test(agente.nombre)).slice(0, 10))
  );

  searchPro = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.propiedades.filter(pro => new RegExp(term, 'mi').test(pro.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) {
    this.agentes = new Array<Model>();
    this.propiedades = new Array<Model>();
  }

  ngOnInit(): void {
    this.getAgentes();
    this.getPropiedades();
  }

  private getAgentes() {
    this._globalService.getData('agentes').subscribe(
      response => {
        if (response.status == 'success') {
          response.data.forEach((data: any) => {
            this.agentes.push({ id: data.id, nombre: data.nombre });
          });
        } else {
          this.agentes = [];
        }
      },
      error => { }
    );
  }

  private getPropiedades() {
    this._globalService.getData('propiedades-dash').subscribe(
      response => {
        if (response.status == 'success') {
          response.data.forEach((data: any) => {
            this.propiedades.push({ id: data.id, nombre: data.nombre });
          });
        } else {
          this.propiedades = [];
        }
      },
      error => { }
    );
  }

  asignar() {
    if (this.agente != null && this.propiedad != null) {
      if (this.agente.id > 0 && this.propiedad.id > 0) {
        this.errorMsn = '';
        this.isError = false;
        this._globalService.asignarAgentePropiedad('asignar-agente-propiedad', this.agente.id, this.propiedad.id).subscribe(
          response => {
            if (response.status == "success") {
              Swal.fire({
                title: 'Agente asignado',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Cool...'
              }).then(() => {
                this.agente = { id: 0, nombre: '' };
                this.propiedad = { id: 0, nombre: '' };
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
        this.errorMsn = 'Debes seleccionar un agente y propiedad válidos...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un agente y propiedad válidos...';
      this.isError = true;
    }
  }

  quitar() {
    if (this.agente != null && this.propiedad != null) {
      if (this.agente.id > 0 && this.propiedad.id > 0) {
        this.errorMsn = '';
        this.isError = false;
        this._globalService.getAgentePropiedad('agente-propiedad-dash', this.agente.id, this.propiedad.id).subscribe(
          response => {
            if (response.status == "success") {
              this._globalService.quitarAgentePropiedad('quitar-agente-propiedad', response.data.id).subscribe(
                response => {
                  if (response.status == "success") {
                    Swal.fire({
                      title: 'Agente quitado',
                      text: response.mensaje,
                      icon: 'success',
                      confirmButtonText: 'Cool...'
                    }).then(() => {
                      this.agente = { id: 0, nombre: '' };
                      this.propiedad = { id: 0, nombre: '' };
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
        this.errorMsn = 'Debes seleccionar un agente y propiedad válidos...';
        this.isError = true;
      }
    } else {
      this.errorMsn = 'Debes seleccionar un agente y propiedad válidos...';
      this.isError = true;
    }
  }

}
