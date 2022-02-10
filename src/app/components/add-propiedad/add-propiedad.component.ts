import { Component, OnInit } from '@angular/core';
import { Propiedad } from '../../models/propiedad';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-propiedad',
  templateUrl: './add-propiedad.component.html',
  styleUrls: ['./add-propiedad.component.css'],
  providers: [GlobalService]
})
export class AddPropiedadComponent implements OnInit {

  public _ruta = Global.ruta;

  public pro: Propiedad;
  public opcion: any;

  public monedas: any;
  public medidas: any;
  public estados: any;
  public categorias: any;
  public ubicaciones: any;

  public habitaciones_banos = [1,2,3,4,5,6,7,8,9,10]

  constructor(
    private _globalService: GlobalService
  ) { 
    this.pro = new Propiedad(0, "", "", "", 0, "", 0, 0, "", 0, 0, 0, 0, "", 0, 0, 0, "", "");
  }

  ngOnInit(): void {
    this.getMonedas();
    this.getMedidas();
    this.getEstados();
    this.getCategorias();
    this.getUbicaciones();
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
    this.pro.slider = this.pro.slider == true ? 1 : 0;

    this._globalService.propiedadAdmin('add-propiedad', this.pro).subscribe(
      response => {
        if(response.status == 'success') {
          let id = response.id;          
          this._globalService.addGraficaPropiedad('add-grafica-propiedad', id).subscribe(
            response => {},
            error => {}
          );
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
            title: 'Propiedad Almacenada!',
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

  onChange(event: any) {    
    switch(this.opcion) {
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
