import { Component, OnInit, ViewChild } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import Swal from 'sweetalert2';

type Model = { id: number, nombre: string };

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css'],
  providers: [GlobalService]
})
export class EditClienteComponent implements OnInit {

  public datos: any;
  public clienteDB: any;
  public _dataurl = Global.dataurl;

  private logoPro = "";
  private isEdit = true;

  @ViewChild('fileUpload')
  private fileUpload!: AngularFileUploaderComponent;

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

  public clientes: Model[];

  public isError: boolean = false;
  public errorMsn: string = '';

  public cliente: Model = { id: 0, nombre: '' };

  formatter = (model: Model) => model.nombre;

  searchCliente = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 0),
    map(term => this.clientes.filter(cliente => new RegExp(term, 'mi').test(cliente.nombre)).slice(0, 10))
  );

  constructor(
    private _globalService: GlobalService
  ) { 
    this.clientes = new Array<Model>();
    this.datos = {
      id: 0,
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
    this.getClientes();
  }

  getClientes() {
    this._globalService.getDataCxC('clientes').subscribe(
      response => {
        if (response.status == "success") {
          this.clientes = response.data;          
        }
      },
      error => { }
    );
  }

  onSubmit() {
    this.datos.logotipo = this.logoPro;
    this._globalService.clienteAdmin('edit-cliente', this.datos).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Cliente modificado!',
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
    if(this.cliente != null && this.cliente.id > 0) {
      this._globalService.getDataCxCId('cliente', this.cliente.id).subscribe(
        response => {
          if(response.status == "success") {
            var data = response.data;
            this.datos = {
              id: data.id,
              nombre: data.nombre,
              direccion: data.direccion,
              representante: data.representante,
              telefono: data.telefono,
              email: data.email,
              rnc: data.rnc,
              ncf: data.ncf,
              logotipo: data.logotipo
            };
            this.logoPro = this.datos.logotipo;
            if(this.fileUpload != null) {
              this.fileUpload.uploadAPI = this._dataurl + 'upload-logo-cliente.php?isEditCliente='+this.isEdit+'&imagen='+this.datos.logotipo;
            }            
          } else {
            this.datos = {
              id: 0,
              nombre: "",
              direccion: "",
              representante: "",
              telefono: "",
              email: "",
              rnc: "",
              ncf: "",
              logotipo: ""
            }
            this.logoPro = "";
          }
        },
        error => {}
      );
    }
  }

  imageUpload(data: any) {
    if (data.body.status == 'success') {
      this.logoPro = data.body.imagen;
      this.onSubmit();
    } else {
      this.logoPro = this.datos.logotipo;
    }
  }

  validarEmail() {        
    let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;    
    return regex.test(this.datos.email);
  }

  validarTelefono() {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(this.datos.telefono);
  }

}
