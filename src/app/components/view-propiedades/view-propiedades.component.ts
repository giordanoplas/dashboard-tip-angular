import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import { faSearch, faMapPin, faBed, faArrowsAlt, faToilet, faAngleDoubleLeft, faAngleDoubleRight, faCity } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-propiedades',
  templateUrl: './view-propiedades.component.html',
  styleUrls: ['./view-propiedades.component.css'],
  providers: [GlobalService]
})
export class ViewPropiedadesComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;
  public propiedades_por_pagina = Global.propiedades_por_pagina;

  public codigoSearch: string = '';
  public isSearch: boolean = false;

  public propiedadesP: any;
  public paginaActual: number = 1;
  public totalPaginas: number = 1;
  public nombreSearch: string = "";
  public dataSearchEmpty: boolean = false;

  faSearch = faSearch;
  faMapPin = faMapPin;
  faBed = faBed;
  faArrowsAlt = faArrowsAlt;
  faToilet = faToilet;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faCity = faCity;

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getPropiedades();
    this.paginacion();
  }  

  private getPropiedades() {
    this._globalService.getData('propiedades-dash').subscribe(
      response => {
        if(response.status == 'success') {
          let propiedades = response.data;
          
          let inicio = (this.paginaActual > 1) ? this.paginaActual * this.propiedades_por_pagina - this.propiedades_por_pagina : 0;
          let fin = (inicio + this.propiedades_por_pagina);
          this.totalPaginas = Math.ceil(propiedades.length / this.propiedades_por_pagina);

          this.propiedadesP = propiedades.slice(inicio, fin);
        } else {
          this.propiedadesP = null;
        }
      },
      error => {}
    );
  }

  private paginacion() {
    this._route.params.subscribe((params) => {
      let p = params.p;
      this.paginaActual = p ? p : 1;
    });
  }

  createRange(number: number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  link(param: any) {
    if(this.isSearch) {
      this._router.navigate(['/propiedades', param]).then(() => {
        this.search();
      });
    } else {
      this._router.navigate(['/propiedades', param]).then(() => {              
        this.getPropiedades();
      }); 
    }       
  }

  nextPage() {
    let n = this.paginaActual;
    n++;
    return n;
  }

  prevPage() {
    let n = this.paginaActual;
    n--;
    return n;
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onBuscar() {
    this.search();
  }

  private search() {
    if(this.nombreSearch.length > 0) {
      this._globalService.searchPropiedades('search-propiedades-nombre', this.nombreSearch).subscribe(
        response => {
          if(response.status == 'success') {
            this.isSearch = true;            
            let propiedades = response.data;
            
            let inicio = (this.paginaActual > 1) ? this.paginaActual * this.propiedades_por_pagina - this.propiedades_por_pagina : 0;
            let fin = (inicio + this.propiedades_por_pagina);
            this.totalPaginas = Math.ceil(propiedades.length / this.propiedades_por_pagina);
  
            this.propiedadesP = propiedades.slice(inicio, fin);
          } else {
            this.isSearch = false;
            this.propiedadesP = null;
            this.dataSearchEmpty = true;
          }
        },
        error => {}
      );
    } else {
      this.isSearch = false;
      this.getPropiedades();
    }
  }

  goEditar(codigo: string) {
    this._router.navigate(['/edit-propiedad', codigo])
      .then(() => {
        location.reload();
      });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Si eliminas esta propiedad, no podrás recuperarla...',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar!',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if(result.isConfirmed) {
        this._globalService.deletePropiedad('delete-propiedad', id).subscribe(
          response => {
            if(response.status == 'success') {
              Swal.fire({
                title: 'Eliminada!',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Cool...'
              }).then(() => {
                this.getPropiedades();
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: response.mensaje,
                icon: 'error',
                confirmButtonText: 'Ok!'
              });
            }
          },
          error => {}
        )    
        this.getPropiedades();
      } else if(result.isDismissed) {
        Swal.fire('Has cancelado la eliminación de esta propiedad...', '', 'info');
      }
    });
  }

}
