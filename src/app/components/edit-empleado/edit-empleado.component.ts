import { Component, OnInit, ViewChild } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-edit-empleado',
  templateUrl: './edit-empleado.component.html',
  styleUrls: ['./edit-empleado.component.css'],
  providers: [GlobalService]
})
export class EditEmpleadoComponent implements OnInit {

  public datos: any;
  public _dataurl = Global.dataurl;

  private fotoPro = "";
  private isEdit = true;

  @ViewChild('fileUpload')
  private fileUpload!: AngularFileUploaderComponent;

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

  public empleados: Model[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public empleado: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchEmpleado = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.empleados.filter(empleado => new RegExp(term, 'mi').test(empleado.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) { 
    this.empleados = new Array<Model>();
    this.datos = {
      id: 0,
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
    this.getEmpleados();
  }

  getEmpleados() {
    this._globalService.getDataCxC('empleados').subscribe(
      response => {
        if (response.status == "success") {
          this.empleados = response.data;          
        }
      },
      error => { }
    );
  }

  onSubmit() {
    this.datos.foto = this.fotoPro;
    this._globalService.clienteAdmin('edit-empleado', this.datos).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Empleado modificado!',
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
    if(this.empleado != null && this.empleado.id > 0) {
      this._globalService.getDataCxCId('empleado', this.empleado.id).subscribe(
        response => {
          if(response.status == "success") {
            var data = response.data;
            this.datos = {
              id: data.id,
              nombre: data.nombre,
              carnet: data.carnet,
              direccion: data.direccion,
              telefono1: data.telefono1,
              telefono2: data.telefono2,
              email: data.email,
              descripcion: data.descripcion,
              foto: data.foto
            }
            this.fotoPro = this.datos.foto;
            if(this.fileUpload != null) {
              this.fileUpload.uploadAPI = this._dataurl + 'upload-foto-empleado.php?isEditEmpleado='+this.isEdit+'&imagen='+this.datos.foto;
            }            
          } else {
            this.datos = {
              id: 0,
              nombre: "",
              carnet: "",
              direccion: "",
              telefono1: "",
              telefono2: "",
              email: "",
              descripcion: "",
              foto: ""
            }
            this.fotoPro = "";
          }
        },
        error => {}
      );
    }
  }

  imageUpload(data: any) {
    if (data.body.status == 'success') {
      this.fotoPro = data.body.imagen;
      this.onSubmit();
    } else {
      this.fotoPro = this.datos.foto;
    }
  }

  validarEmail() {        
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;    
    return regex.test(this.datos.email);
  }

  validarTelefono(tel: string) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(tel);
  }

}
