import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-agentes',
  templateUrl: './view-agentes.component.html',
  styleUrls: ['./view-agentes.component.css'],
  providers: [GlobalService]
})
export class ViewAgentesComponent implements OnInit {

  public _ruta = Global.ruta;
  public _data = Global.dataurl;

  public agentes: any;
  public dataSearchEmpty: boolean = false;
  public nombreSearch: string = "";

  constructor(
    private _globalService: GlobalService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAgentes();
  }

  private getAgentes() {
    this._globalService.getData('agentes').subscribe(
      response => {
        if(response.status == 'success') {
          this.agentes = response.data;
        } else {
          this.agentes = null;
        }
      },
      error => {}
    );
  }

  goEditar(id: number) {
    this._router.navigate(['/edit-agente', id])
      .then(() => {
        location.reload();
      });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Si eliminas este agente, no podrás recuperarlo...',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar!',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if(result.isConfirmed) {
        this._globalService.deleteAgente('delete-agente', id).subscribe(
          response => {
            if(response.status == 'success') {
              Swal.fire({
                title: 'Eliminado!',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Cool...'
              }).then(() => {
                this.getAgentes();
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
        );    
      } else if(result.isDismissed) {
        Swal.fire('Has cancelado la eliminación de este agente...', '', 'info');
      }
    });
  }

  search() {
    if(this.nombreSearch.trim().length > 0) {
      this._globalService.searchAgentes('search-agentes-nombre', this.nombreSearch).subscribe(
        response => {
          if(response.status == 'success') {
            this.agentes = response.data;            
          } else {
            this.agentes = null;
            this.dataSearchEmpty = true;
          }
        },
        error => {}
      );
    }
  }
}
