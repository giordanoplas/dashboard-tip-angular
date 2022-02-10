import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

@Injectable()
export class GlobalService {

    private dataurl: string;
    private loginjson: string;
    private datajson: string;
    private datacxcjson: string;

    private headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private _http: HttpClient
    ) {
        this.dataurl = Global.dataurl;
        this.loginjson = "login_json.php";
        this.datajson = "data_json.php";
        this.datacxcjson = "data_cxc_json.php";
    }

    getLogin(usuario: string, password: string): Observable<any> {
        let params = JSON.stringify({ "usuario": usuario, "password": password });
        return this._http.post(this.dataurl + this.loginjson, params, { headers: this.headers });
    }

    getData(data: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data);
    }

    getAgente(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id);
    }

    propiedadAdmin(data: string, params: any): Observable<any> {
        let paramsD = JSON.stringify(params);
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&params="+paramsD);
    }

    agenteAdmin(data: string, params: any): Observable<any> {
        let paramsD = JSON.stringify(params);
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&params="+paramsD);
    }

    getPropiedadCodigo(data: string, codigo: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&codigo="+codigo);
    }

    updateThumbAgente(data: string, id: number, thumb: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id+"&thumb="+thumb);
    }

    searchPropiedades(data: string, nombre: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&nombre="+nombre);
    }

    deletePropiedad(data: string, propiedadID: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&propiedadID="+propiedadID);
    }  
    
    deleteAgente(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id);
    }  

    getMultimediaPropiedad(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id);
    }

    addMultimedia(data: string, id: number, imagenes: any, videos: any, hasPrincipal: boolean): Observable<any> {
        let imagenesD = JSON.stringify(imagenes);
        let videosD = JSON.stringify(videos);
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id+"&imagenes="+imagenesD+"&videos="+videosD+"&hasPrincipal="+hasPrincipal);
    }

    deleteImagen(data: string, id: number, imagen: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id+"&imagen="+imagen);
    }

    deleteVideo(data: string, id: number, video: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id+"&video="+video);
    }

    updatePrincipalMultimedia(data: string, propiedadID: number, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&propiedadID="+propiedadID+"&id="+id);
    }

    updateVideoPopup(data: string, id: number, cabecera: any, mensaje: any): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id+"&cabecera="+cabecera+"&mensaje="+mensaje);
    }

    searchAgentes(data: string, nombre: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&nombre="+nombre);
    }

    getAgentePropiedad(data: string, agenteID: number, propiedadID: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&agenteID="+agenteID+"&propiedadID="+propiedadID);
    }

    asignarAgentePropiedad(data: string, agenteID: number, propiedadID: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&agenteID="+agenteID+"&propiedadID="+propiedadID);
    }

    quitarAgentePropiedad(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&id="+id);
    }

    getGraficaPropiedades(data: string, mes: number, year: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&mes="+mes+"&year="+year);
    }

    getGraficaVenAlq(data: string, estadoID: number, mes: number, year: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&estadoID="+estadoID+"&mes="+mes+"&year="+year);
    }

    addGraficaPropiedad(data: string, propiedadID: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&propiedadID="+propiedadID);
    }

    addGraficaVenAlq(data: string, propiedadID: number, estadoID: number): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&propiedadID="+propiedadID+"&estadoID="+estadoID);
    }

    searchUsersLog(data: string, datos: string): Observable<any> {
        return this._http.get(this.dataurl + this.datajson + "?data="+data+"&datos="+datos);
    }

    /*--- AREA CUENTAS POR COBRAR ---*/
    getDataCxC(data: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data);
    }

    getDataCxCId(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id);
    }

    searchClientes(data: string, nombre: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&nombre="+nombre);
    }

    clienteAdmin(data: string, params: any): Observable<any> {
        let paramsD = JSON.stringify(params);
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&params="+paramsD);
    }

    searchCuentasLog(data: string, datos: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&datos="+datos);
    }

    searchCuentasId(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id);
    }

    searchCuentasLogDate(data: string, id: number, fechaI: string, fechaF: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id+"&fechaI="+fechaI+"&fechaF="+fechaF);
    }

    addLogoCliente(data: string, id: number, imagen: any): Observable<any> {
        let imagenD = JSON.stringify(imagen);
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id+"&imagen="+imagenD);
    }

    deleteCuenta(data: string, id: number): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id);
    }

    getFacturaCxC(data: string, factura: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&factura="+factura);
    }

    deleteFactura(data: string, id: number, facturaN: string): Observable<any> {
        return this._http.get(this.dataurl + this.datacxcjson + "?data="+data+"&id="+id+"&facturaN="+facturaN);
    }
}