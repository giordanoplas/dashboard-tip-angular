import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nominas-empleados',
  templateUrl: './nominas-empleados.component.html',
  styleUrls: ['./nominas-empleados.component.css'],
  providers: [GlobalService]
})
export class NominasEmpleadosComponent implements OnInit {

  public empleado: any;

  afuConfigImages = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 10,
    uploadAPI: {
      url: Global.dataurl + 'upload-foto-empleado.php'
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
    this.empleado = {
      nombre: "",
      carnet: "",
      direccion: "",
      telefono1: "",
      telefono2: "",
      email: "",
      descripcion: "",
      foto: ""
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this._globalService.clienteAdmin('add-empleado', this.empleado).subscribe(
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
      this.empleado.foto = data.body.imagen;
    } else {
      this.empleado.foto = "";
    }
  }

  validarEmail() {        
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;    
    return regex.test(this.empleado.email);
  }

  validarTelefono(tel: string) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(tel);
  }

}
