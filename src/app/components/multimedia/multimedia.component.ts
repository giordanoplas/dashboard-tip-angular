import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css'],
  providers: [GlobalService]
})
export class MultimediaComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;
  public codigo: string = "";

  public isInput: boolean = false;
  private hasPrincipal: boolean = false;

  public mpCabecera: string = "";
  public mpMensaje: string = "";
  public isPopup: boolean = false;

  public propiedad: any;
  public propiedadImagenes: any;
  public propiedadVideos: any;

  faSearch = faSearch;
  faTrashAlt = faTrashAlt;

  afuConfigImages = {
    multiple: true,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: 10,
    uploadAPI: {
      url: Global.dataurl + 'upload-images.php'
    },
    theme: "dragNDrop",
    hideProgressBar: false,
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

  afuConfigVideos = {
    multiple: true,
    formatsAllowed: ".mp4, .avi, .mkv, .mov",
    maxSize: 500,
    uploadAPI: {
      url: Global.dataurl + 'upload-videos.php'
    },
    theme: "dragNDrop",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Selecciona los videos',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Arrastrar aquí',
      attachPinBtn: 'Adjuntar video...',
      afterUploadMsg_success: 'Carga satisfactoria!',
      afterUploadMsg_error: 'Carga fallida!',
      sizeLimit: 'Tamaño máximo'
    }
  };

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCodigoPropiedad();
  }

  private getCodigoPropiedad() {
    this._route.params.subscribe((params) => {
      let codigo = params.codigo;
      if (codigo != null) {
        this.codigo = codigo;
        this.getDataMultimedia();
      } else {
        this._router.navigate(['/']);
      }
    });
  }

  private getMultimedia(id: number) {
    this._globalService.getMultimediaPropiedad('propiedad-multimedia', id).subscribe(
      response => {
        if (response.status == 'success') {
          this.propiedadImagenes = response.imagenes;
          this.propiedadVideos = response.videos;

          if (this.propiedadImagenes != null) {
            this.propiedadImagenes.forEach((pi: any) => {
              if (pi.principal === 1) {
                this.hasPrincipal = true;
              }
            });
          }
        } else {
          this.propiedadImagenes = null;
          this.propiedadVideos = null;
        }
      },
      error => { }
    );
  }

  deleteImagen(id: number, imagen: string, principal: number) {
    if (principal === 1 && this.propiedadImagenes.length > 1) {
      Swal.fire({
        title: 'Precaución',
        text: "Solo puedes eliminar la imagen principal si es la única que queda...",
        icon: 'warning',
        confirmButtonText: 'Ok!'
      });
    } else {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Si eliminas esta imagen, no podrás recuperarla...',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          this._globalService.deleteImagen('delete-imagen', id, imagen).subscribe(
            response => {
              if (response.status == 'success') {
                Swal.fire({
                  title: 'Imagen eliminada',
                  text: response.mensaje,
                  icon: 'success',
                  confirmButtonText: 'Cool...'
                }).then(() => {
                  //this.getDataMultimedia();
                  location.reload();
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: response.mensaje,
                  icon: 'error',
                  confirmButtonText: 'Ok!'
                }).then(() => {
                  location.reload();
                });
              }
            },
            error => { }
          );
        } else if (result.isDismissed) {
          Swal.fire('Has cancelado la eliminación de esta imagen...', '', 'info');
        }
      });
    }
  }

  deleteVideo(id: number, video: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Si eliminas este video, no podrás recuperarlo...',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar!',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this._globalService.deleteVideo('delete-video', id, video).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire({
                title: 'Video eliminado',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Cool...'
              }).then(() => {
                //this.getDataMultimedia();
                location.reload();
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: response.mensaje,
                icon: 'error',
                confirmButtonText: 'Ok!'
              }).then(() => {
                location.reload();
              });
            }
          },
          error => { }
        );
      } else if (result.isDismissed) {
        Swal.fire('Has cancelado la eliminación de este video...', '', 'info');
      }
    });
  }

  getDataMultimedia() {
    if (this.codigo.length == 6) {
      this._globalService.getPropiedadCodigo('propiedad-codigo', this.codigo).subscribe(
        response => {
          if (response.status == 'success') {
            this.propiedad = response.data;
            this.afuConfigImages.uploadAPI.url = Global.dataurl + 'upload-images.php?estadoOrden=' + this.propiedad.estadoOrden;
            this.afuConfigVideos.uploadAPI.url = Global.dataurl + 'upload-videos.php?estadoOrden=' + this.propiedad.estadoOrden;
            this.getMultimedia(this.propiedad.id);
          } else {
            this.propiedad = null;
          }
        },
        error => { }
      );
    } else {
      this.propiedad = null;
    }
  }

  imageUpload(data: any) {
    if (data.body.status == 'success') {
      console.log(this.hasPrincipal);
      this._globalService.addMultimedia('add-multimedia', this.propiedad.id, data.body.imagenes, data.body.videos, this.hasPrincipal).subscribe(
        response => {
          if (response.status == 'success') {
            Swal.fire({
              title: 'Imágenes cargadas',
              text: response.mensaje,
              icon: 'success',
              confirmButtonText: 'Cool...'
            }).then(() => {
              //this.getDataMultimedia();
              location.reload();
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
        text: data.body.mensaje,
        icon: 'error',
        confirmButtonText: 'Ok!'
      });
    }
  }

  videoUpload(data: any) {
    if (data.body.status == 'success') {
      this._globalService.addMultimedia('add-multimedia', this.propiedad.id, data.body.imagenes, data.body.videos, false).subscribe(
        response => {
          if (response.status == 'success') {
            Swal.fire({
              title: 'Videos cargados',
              text: response.mensaje,
              icon: 'success',
              confirmButtonText: 'Cool...'
            }).then(() => {
              //this.getDataMultimedia();
              location.reload();
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
        text: data.body.mensaje,
        icon: 'error',
        confirmButtonText: 'Ok!'
      });
    }
  }

  onChange(propiedadID: number, id: number) {
    this._globalService.updatePrincipalMultimedia('update-principal-imagen', propiedadID, id).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Principal',
            text: response.mensaje,
            icon: 'success',
            confirmButtonText: 'Cool...'
          }).then(() => {
            this.getDataMultimedia();
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
  }

  onSubmitPopup(id: number, cabecera: string, mensaje: string) {
    this._globalService.updateVideoPopup('update-video-popup', id, cabecera, mensaje).subscribe(
      response => {
        if (response.status == 'success') {
          Swal.fire({
            title: 'Popup actualizado!',
            text: response.mensaje,
            icon: 'success',
            confirmButtonText: 'Cool...'
          }).then(() => {
            this.getDataMultimedia();
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
  }

  onChangePopup(event: any, id: number) {
    let video = this.propiedadVideos.find((video: any) => video.id === id);

    if (!event?.target.checked) {
      this.isInput = false;

      if (video.mp_cabecera.trim() != "" && video.mp_mensaje.trim() != "") {
        this.mpCabecera = "";
        this.mpMensaje = "";

        this.onSubmitPopup(id, this.mpCabecera, this.mpMensaje);
      }
    } else {
      this.isInput = true;
    }
  }

  onInput() {
    this.isInput = true;
  }

}
