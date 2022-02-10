import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { ChartColor, ChartLabel } from '@rinminase/ng-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GlobalService]
})
export class HomeComponent implements OnInit {

  public _ruta = Global.ruta;

  public isEstadisticas: boolean = false;
  public isGraficaPro: boolean = false;
  public isGraficaVenal: boolean = false;

  public visitas: number = 0;
  public registros: number = 0;
  public ingresos: number = 0;
  public visitasSP: number = 0;
  public registrosSP: number = 0;
  public ingresosSP: number = 0;

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 
    'Octubre', 'Noviembre', 'Diciembre'];

  chartData1 = [{ data: Array<number>(), label: '' }];
  chartData2 = [{ data: Array<number>(), label: '' }];

  chartOptions = {
    responsive: true,
  };

  chartColors: ChartColor = [
    {
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,.3)'
    },
  ];
  chartColors2: ChartColor = [    
    {
      borderColor: 'gray',
      backgroundColor: 'rgba(128, 128, 128, .3)'
    },
    {
      borderColor: 'green',
      backgroundColor: 'rgba(20,255,0,0.3)'
    }
  ];

  chartLegend = true;
  chartPlugins = [];

  constructor(
    private _globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getEstadisticas();
    this.getGraficas();
  }

  private getGraficas() {
    let arr: any = [];
    let arr2: any = [];
    let arr3: any = [];
    var date = new Date();

    this.meses.forEach(m => {
      var mes: number;

      switch(m) {
        case 'Enero': mes = 1; break;
        case 'Febrero': mes = 2; break;
        case 'Marzo': mes = 3; break;
        case 'Abril': mes = 4; break;
        case 'Mayo': mes = 5; break;
        case 'Junio': mes = 6; break;
        case 'Julio': mes = 7; break;
        case 'Agosto': mes = 8; break;
        case 'Septiembre': mes = 9; break;
        case 'Octubre': mes = 10; break;
        case 'Noviembre': mes = 11; break;
        case 'Diciembre': mes = 12; break;
        default: mes = 0; break;
      }      

      this._globalService.getGraficaPropiedades('grafica-propiedad', mes, date.getFullYear()).subscribe(
        response => {
          if(response.status == 'success') {
            let count = response.data.count;
            arr.push(count);
          }
        },
        error => {}
      );
      // Gráfica Venta
      this._globalService.getGraficaVenAlq('grafica-venal', 1, mes, date.getFullYear()).subscribe(
        response => {
          if(response.status == 'success') {
            let count = response.data.count;
            arr2.push(count);
          }
        },
        error => {}
      );
      // Gráfica Alquiler
      this._globalService.getGraficaVenAlq('grafica-venal', 2, mes, date.getFullYear()).subscribe(
        response => {
          if(response.status == 'success') {
            let count = response.data.count;
            arr3.push(count);
          }
        },
        error => {}
      );
    });   

    this.chartData1 = [{data: arr, label: "Propiedades"}];
    this.chartData2 = [
      { data: arr2, label: "Venta" },
      { data: arr3, label: "Alquiler" }
    ];

    this.isGraficaPro = this.chartData1.length > 0 ? true : false;
    this.isGraficaVenal = this.chartData2.length > 0 ? true : false;
  }

  private getEstadisticas() {
    this._globalService.getData('estadisticas').subscribe(
      response => {
        if(response.status == 'success') {
          let estadisticas = response.data;
          this.visitas = estadisticas.visitas;
          this.registros = estadisticas.registros;
          this.ingresos = estadisticas.ingresos;

          this.isEstadisticas = true;
        } else {
          this.isEstadisticas = false;
        }
      },
      error => {}
    );
  }

}
