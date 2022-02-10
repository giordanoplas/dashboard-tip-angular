import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-inquilino',
  templateUrl: './add-inquilino.component.html',
  styleUrls: ['./add-inquilino.component.css'],
  providers: [GlobalService]
})
export class AddInquilinoComponent implements OnInit {

  public inquilino: any;

  constructor(
    private _globalService: GlobalService
  ) { 
    this.inquilino = {
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

  ngOnInit(): void {}

  onSubmit() {
    this._globalService.clienteAdmin('add-inquilino', this.inquilino).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Inquilino almacenado!',
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

  validarEmail() {        
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;    
    return regex.test(this.inquilino.email);
  }

  validarTelefono(telefono: string) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(telefono);
  }

}
