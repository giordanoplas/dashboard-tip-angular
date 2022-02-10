import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css'],
  providers: [GlobalService]
})
export class AddClienteComponent implements OnInit {

  public cliente: any;

  afuConfigImages = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 10,
    uploadAPI: {
      url: Global.dataurl + 'upload-logo-cliente.php'
    },
    theme: "dragNDrop",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Selecciona la imagen',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Arrastrar aquí',
      attachPinBtn: 'Adjuntar imagen...',
      afterUploadMsg_success: 'Carga satisfactoria!',
      afterUploadMsg_error: 'Carga fallida!',
      sizeLimit: 'Tamaño máximo'
    }
  };

  constructor(
    private _globalService: GlobalService
  ) { 
    this.cliente = {
      nombre: "",
      direccion: "",
      representante: "",
      telefono: "",
      email: "",
      rnc: "",
      ncf: "",
      logotipo: ""
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this._globalService.clienteAdmin('add-cliente', this.cliente).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Cliente almacenado!',
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

  imageUpload(data: any) {
    if (data.body.status == 'success') {
      this.cliente.logotipo = data.body.imagen;
    } else {
      this.cliente.logotipo = "";
    }
  }

  validarEmail() {        
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;    
    return regex.test(this.cliente.email);
  }

  validarTelefono() {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(this.cliente.telefono);
  }

}
