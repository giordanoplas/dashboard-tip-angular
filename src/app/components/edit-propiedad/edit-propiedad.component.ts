import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-propiedad',
  templateUrl: './edit-propiedad.component.html',
  styleUrls: ['./edit-propiedad.component.css'],
  providers: [GlobalService]
})
export class EditPropiedadComponent implements OnInit {

  public _ruta = Global.ruta;

  public pro: any;
  public proDB: any;
  public opcion: any;
  public medidaID = 0;
  public monedaID = 0;

  public monedas: any;
  public medidas: any;
  public estados: any;
  public categorias: any;
  public ubicaciones: any;

  public habitaciones_banos = [1,2,3,4,5,6,7,8,9,10]

  faPhotoVideo = faPhotoVideo;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {    
    this.getPropiedadDB();
    this.getMonedas();
    this.getMedidas();
    this.getEstados();
    this.getCategorias();
    this.getUbicaciones();    
  }

  private getPropiedadDB() {
    this._route.params.subscribe((params) => {
      let codigo = params.codigo;
      if(codigo != null) {
        this._globalService.getPropiedadCodigo('propiedad-codigo', codigo).subscribe(
          response => {
            if(response.status == 'success') {
              this.pro = response.data;
              if(this.pro.destacado == 1) this.opcion = 1;
              else if(this.pro.vendido == 1) this.opcion = 2
              else if(this.pro.alquilado == 1) this.opcion = 3;
              else this.opcion = 0;
              this.medidaID = this.pro.medidaID;
              this.monedaID = this.pro.monedaID;
            } else {
              this.pro = null;
            }
            
          },
          error => {}
        );
      } else {
        this._router.navigate(['/']);
      }
    });
  }

  private getMonedas() {
    this._globalService.getData("monedas").subscribe(
      response => {
        if(response.status == 'success') {
          this.monedas = response.data;
          this.pro.monedaID = this.monedas[0].id;
        }
      },
      error => {}
    );
  }

  private getMedidas() {
    this._globalService.getData("medidas").subscribe(
      response => {
        if(response.status == 'success') {
          this.medidas = response.data;
          this.pro.medidaID = this.medidas[0].id;
        }
      },
      error => {}
    );
  }

  private getEstados() {
    this._globalService.getData("estados").subscribe(
      response => {
        if(response.status == 'success') {
          this.estados = response.data;
        }
      },
      error => {}
    );
  }

  private getCategorias() {
    this._globalService.getData("categorias").subscribe(
      response => {
        if(response.status == 'success') {
          this.categorias = response.data;
        }
      },
      error => {}
    );
  }

  private getUbicaciones() {
    this._globalService.getData("ubicaciones").subscribe(
      response => {
        if(response.status == 'success') {
          this.ubicaciones = response.data;
        }
      },
      error => {}
    );
  }

  onSubmit() {
    this.pro.monedaID = this.monedaID;
    this.pro.medidaID = this.medidaID; 
    this.pro.slider = this.pro.slider == true ? 1 : 0;

    this._globalService.propiedadAdmin('edit-propiedad', this.pro).subscribe(
      response => {
        if(response.status == 'success') {
          let id = this.pro.id;  
          if(this.pro.vendido == 1) {
            this._globalService.addGraficaVenAlq('add-grafica-venal', id, 1).subscribe(
              response => {},
              error => {}
            );
          }
          if(this.pro.alquilado == 1) {
            this._globalService.addGraficaVenAlq('add-grafica-venal', id, 2).subscribe(
              response => {},
              error => {}
            );
          }
          Swal.fire({
            title: 'Propiedad Modificada!',
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

  test() {
    console.log(this.pro.medidaID);
  }

  onChange(event: any) { 
    switch(event.target.value) {
      case '0': 
        this.pro.destacado = 0;
        this.pro.vendido = 0;
        this.pro.alquilado = 0;
        break;
      case '1': 
        this.pro.destacado = 1;
        this.pro.vendido = 0;
        this.pro.alquilado = 0;
        break;
      case '2': 
        this.pro.destacado = 0;
        this.pro.vendido = 1;
        this.pro.alquilado = 0;
        break;
      case '3': 
        this.pro.destacado = 0;
        this.pro.vendido = 0;
        this.pro.alquilado = 1;
        break;
      default:
        this.pro.destacado = 0;
        this.pro.vendido = 0;
        this.pro.alquilado = 0;
        break;
    }
  }

}
