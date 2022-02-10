import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Agente } from '../../models/agente';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { AngularFileUploaderComponent } from "angular-file-uploader";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-agente',
  templateUrl: './edit-agente.component.html',
  styleUrls: ['./edit-agente.component.css'],
  providers: [GlobalService]
})
export class EditAgenteComponent implements OnInit {

  public _data = Global.dataurl;
  public thumbActual: string = "";

  public agente: Agente;

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 10,
    uploadAPI: {
      url: Global.dataurl+'upload-thumb.php'
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Selecciona las imágenes',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Arrastrar aquí',
      attachPinBtn: 'Adjuntar imagen...',
      afterUploadMsg_success: 'Carga satisfactoria!',
      afterUploadMsg_error: 'Carga fallida!',
      sizeLimit: 'Tamaño máximo'
    }
  };

  @ViewChild('fileUpload1')
  private fileUpload1!:  AngularFileUploaderComponent;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
    this.agente = new Agente(0,"","","","M","","","","",0,"","","","");
  }

  ngOnInit(): void {   
    this.getAgente();     
  }

  private getAgente() {
    this._route.params.subscribe((params) => {
      let id = params.id
      if(id != null) {
        this._globalService.getAgente('agente', id).subscribe(
          response => {            
            if(response.status == 'success') {
              this.agente = response.data;
              this.thumbActual = this.agente.thumb;              
              this.fileUpload1.uploadAPI = Global.dataurl+'upload-thumb.php?thumbActual='+this.thumbActual;                
            } else {
              this._router.navigate(['/agentes']);
            }
          },
          error => {}
        );
      } else {
        this._router.navigate(['/agentes']);
      }      
    });    
  }

  onSubmit() {    
    this._globalService.agenteAdmin('edit-agente', this.agente).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Agente editado!',
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
      error => {}
    );
  }

  upload(data: any) {
    if (data.body.status == 'success') {
      this.agente.thumb = data.body.thumb;
      this._globalService.updateThumbAgente('update-thumb-agente', this.agente.id, this.agente.thumb).subscribe(
        response => {          
          if(response.status == 'success') {
            Swal.fire({
              title: 'Imagen cambiada!',
              text: response.mensaje,
              icon: 'success',
              confirmButtonText: 'Cool!'
            }).then(() => {
              location.reload();
            });            
          }
        },
        error => {}
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: data.body.mensaje,
        icon: 'error',
        confirmButtonText: 'Ok!'
      });
    }
  }

  onChange(event: any) {
    let sexo = event.target.value;
    if(sexo != null) {
      this.agente.sexo = sexo;
    }
  }

}
