import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from "@rinminase/ng-charts";
import { AngularFileUploaderModule } from "angular-file-uploader";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './components/header/header.component';
import { BarraIzquierdaComponent } from './components/barra-izquierda/barra-izquierda.component';
import { PropiedadesComponent } from './components/propiedades/propiedades.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { MultimediaComponent } from './components/multimedia/multimedia.component';
import { AddPropiedadComponent } from './components/add-propiedad/add-propiedad.component';
import { ViewPropiedadesComponent } from './components/view-propiedades/view-propiedades.component';
import { EditPropiedadComponent } from './components/edit-propiedad/edit-propiedad.component';
import { ViewAgentesComponent } from './components/view-agentes/view-agentes.component';
import { AddAgenteComponent } from './components/add-agente/add-agente.component';
import { EditAgenteComponent } from './components/edit-agente/edit-agente.component';
import { AgentePropiedadComponent } from './components/agente-propiedad/agente-propiedad.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogComponent } from './components/user-log/user-log.component';
import { CuentasPorCobrarComponent } from './components/cuentas-por-cobrar/cuentas-por-cobrar.component';
import { ViewCxcComponent } from './components/view-cxc/view-cxc.component';
import { CuentasPorCobrarSingleComponent } from './components/cuentas-por-cobrar-single/cuentas-por-cobrar-single.component';
import { AddClienteComponent } from './components/add-cliente/add-cliente.component';
import { AddLugarComponent } from './components/add-lugar/add-lugar.component';
import { AddInquilinoComponent } from './components/add-inquilino/add-inquilino.component';
import { AsignarLugarClienteComponent } from './components/asignar-lugar-cliente/asignar-lugar-cliente.component';
import { DivisionesPisoLugarComponent } from './components/divisiones-piso-lugar/divisiones-piso-lugar.component';
import { CuentasInquilinoComponent } from './components/cuentas-inquilino/cuentas-inquilino.component';
import { DeudasInquilinoComponent } from './components/deudas-inquilino/deudas-inquilino.component';
import { LugarInquilinoComponent } from './components/lugar-inquilino/lugar-inquilino.component';
import { EditClienteComponent } from './components/edit-cliente/edit-cliente.component';
import { EditLugarComponent } from './components/edit-lugar/edit-lugar.component';
import { EditInquilinoComponent } from './components/edit-inquilino/edit-inquilino.component';
import { FacturarComponent } from './components/facturar/facturar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { ClientesCuentasComponent } from './components/clientes-cuentas/clientes-cuentas.component';
import { DeudasClienteComponent } from './components/deudas-cliente/deudas-cliente.component';
import { FacturarClienteComponent } from './components/facturar-cliente/facturar-cliente.component';
import { NumberWithCommasPipe } from './pipes/number-with-commas.pipe';
import { CuentasPorPagarComponent } from './components/cuentas-por-pagar/cuentas-por-pagar.component';
import { ViewCXPComponent } from './components/view-cxp/view-cxp.component';
import { PagarCXPComponent } from './components/pagar-cxp/pagar-cxp.component';
import { ReciboInquilinoComponent } from './components/recibo-inquilino/recibo-inquilino.component';
import { ReciboClienteComponent } from './components/recibo-cliente/recibo-cliente.component';
import { FacturasClienteComponent } from './components/facturas-cliente/facturas-cliente.component';
import { FacturasInquilinoComponent } from './components/facturas-inquilino/facturas-inquilino.component';
import { NominasComponent } from './components/nominas/nominas.component';
import { NominasEmpleadosComponent } from './components/nominas-empleados/nominas-empleados.component';
import { NominasPagosComponent } from './components/nominas-pagos/nominas-pagos.component';
import { ViewNominasComponent } from './components/view-nominas/view-nominas.component';
import { AddEmpleadoComponent } from './components/add-empleado/add-empleado.component';
import { EditEmpleadoComponent } from './components/edit-empleado/edit-empleado.component';
import { NominasNominaComponent } from './components/nominas-nomina/nominas-nomina.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    BarraIzquierdaComponent,
    PropiedadesComponent,
    AgentesComponent,
    MultimediaComponent,
    AddPropiedadComponent,
    ViewPropiedadesComponent,
    EditPropiedadComponent,
    ViewAgentesComponent,
    AddAgenteComponent,
    EditAgenteComponent,
    AgentePropiedadComponent,
    UserLogComponent,
    CuentasPorCobrarComponent,
    ViewCxcComponent,
    CuentasPorCobrarSingleComponent,
    AddClienteComponent,
    AddLugarComponent,
    AddInquilinoComponent,
    AsignarLugarClienteComponent,
    DivisionesPisoLugarComponent,
    CuentasInquilinoComponent,
    DeudasInquilinoComponent,
    LugarInquilinoComponent,
    EditClienteComponent,
    EditLugarComponent,
    EditInquilinoComponent,
    FacturarComponent,
    UsuariosComponent,
    UserViewComponent,
    ClientesCuentasComponent,
    DeudasClienteComponent,
    FacturarClienteComponent,
    NumberWithCommasPipe,
    CuentasPorPagarComponent,
    ViewCXPComponent,
    PagarCXPComponent,
    ReciboInquilinoComponent,
    ReciboClienteComponent,
    FacturasClienteComponent,
    FacturasInquilinoComponent,
    NominasComponent,
    NominasEmpleadosComponent,
    NominasPagosComponent,
    ViewNominasComponent,
    AddEmpleadoComponent,
    EditEmpleadoComponent,
    NominasNominaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ChartsModule,
    AngularFileUploaderModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
