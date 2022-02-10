import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lugar',
  templateUrl: './add-lugar.component.html',
  styleUrls: ['./add-lugar.component.css'],
  providers: [GlobalService]
})
export class AddLugarComponent implements OnInit {

  public lugar: any;
  public lugarTipos: any;

  constructor(
    private _globalService: GlobalService
  ) { 
    this.lugar = {
      nombre: "",
      lugarTipoID: 0,
      cantPisos: 1,
      descripcion: ""
    }
  }

  ngOnInit(): void {
    this.getLugarTipos();
  }

  getLugarTipos() {
    this._globalService.getDataCxC('lugar-tipos').subscribe(
      response => {
        if(response.status == "success") {
          this.lugarTipos = response.data;
        } else {
          this.lugarTipos = null;
        }
      },
      error => {}
    );
  }

  onSubmit() {
    this._globalService.clienteAdmin('add-lugar', this.lugar).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Lugar almacenado!',
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

}