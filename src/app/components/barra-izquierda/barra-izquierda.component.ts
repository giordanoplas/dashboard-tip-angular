import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faThLarge, faBuilding, faUserTie, faPhotoVideo, faFileContract, faSignOutAlt, faUsersCog, faFileInvoiceDollar, faIdBadge } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-barra-izquierda',
  templateUrl: './barra-izquierda.component.html',
  styleUrls: ['./barra-izquierda.component.css']
})
export class BarraIzquierdaComponent implements OnInit {

  faThLarge = faThLarge;
  faBuilding = faBuilding;
  faUserTie = faUserTie;
  faPhotoVideo = faPhotoVideo;
  faFileContract = faFileContract;
  faSignOutAlt = faSignOutAlt;
  faUsersCog = faUsersCog;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faIdBadge = faIdBadge;

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  clearSession() {
    window.localStorage.clear();
    this._router.navigate(['/login']).then(() => {
      location.reload();
    });
  }

}
