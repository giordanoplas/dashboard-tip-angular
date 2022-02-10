import { Component, OnInit } from '@angular/core';
import { Agente } from '../../models/agente';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-agente',
  templateUrl: './add-agente.component.html',
  styleUrls: ['./add-agente.component.css'],
  providers: [GlobalService]
})
export class AddAgenteComponent implements OnInit {

  public agente: Agente;

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 10,
    uploadAPI: {
      url: Global.dataurl + 'upload-thumb.php'
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

  constructor(
    private _globalService: GlobalService
  ) { 
    this.agente = new Agente(0,"","","","M","","","","",0,"","","","");
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this._globalService.agenteAdmin('add-agente', this.agente).subscribe(
      response => {
        if(response.status == 'success') {
          Swal.fire({
            title: 'Agente almacenado!',
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
