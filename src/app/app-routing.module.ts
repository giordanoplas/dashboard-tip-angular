import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PropiedadesComponent } from './components/propiedades/propiedades.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { MultimediaComponent } from './components/multimedia/multimedia.component';
import { EditPropiedadComponent } from './components/edit-propiedad/edit-propiedad.component';
import { EditAgenteComponent } from './components/edit-agente/edit-agente.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CuentasPorCobrarComponent } from './components/cuentas-por-cobrar/cuentas-por-cobrar.component';
import { CuentasPorCobrarSingleComponent } from './components/cuentas-por-cobrar-single/cuentas-por-cobrar-single.component';
import { AddClienteComponent } from './components/add-cliente/add-cliente.component';
import { AddLugarComponent } from './components/add-lugar/add-lugar.component';
import { AddInquilinoComponent } from './components/add-inquilino/add-inquilino.component';
import { EditClienteComponent } from './components/edit-cliente/edit-cliente.component';
import { EditLugarComponent } from './components/edit-lugar/edit-lugar.component';
import { EditInquilinoComponent } from './components/edit-inquilino/edit-inquilino.component';
import { AsignarLugarClienteComponent } from './components/asignar-lugar-cliente/asignar-lugar-cliente.component';
import { DivisionesPisoLugarComponent } from './components/divisiones-piso-lugar/divisiones-piso-lugar.component';
import { LugarInquilinoComponent } from './components/lugar-inquilino/lugar-inquilino.component';
import { DeudasInquilinoComponent } from './components/deudas-inquilino/deudas-inquilino.component';
import { CuentasInquilinoComponent } from './components/cuentas-inquilino/cuentas-inquilino.component';
import { FacturarComponent } from './components/facturar/facturar.component';
import { ReciboInquilinoComponent } from './components/recibo-inquilino/recibo-inquilino.component';
import { FacturarClienteComponent } from './components/facturar-cliente/facturar-cliente.component';
import { ClientesCuentasComponent } from './components/clientes-cuentas/clientes-cuentas.component';
import { DeudasClienteComponent } from './components/deudas-cliente/deudas-cliente.component';
import { CuentasPorPagarComponent } from './components/cuentas-por-pagar/cuentas-por-pagar.component';
import { ReciboClienteComponent } from './components/recibo-cliente/recibo-cliente.component';
import { FacturasClienteComponent } from './components/facturas-cliente/facturas-cliente.component';
import { FacturasInquilinoComponent } from './components/facturas-inquilino/facturas-inquilino.component';
import { NominasComponent } from './components/nominas/nominas.component';
import { AddEmpleadoComponent } from './components/add-empleado/add-empleado.component';
import { EditEmpleadoComponent } from './components/edit-empleado/edit-empleado.component';
import { NominasPagosComponent } from './components/nominas-pagos/nominas-pagos.component';
import { NominasNominaComponent } from './components/nominas-nomina/nominas-nomina.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'propiedades/:p', component: PropiedadesComponent },
  { path: 'multimedia', component: MultimediaComponent },
  { path: 'multimedia/:codigo', component: MultimediaComponent },
  { path: 'agentes', component: AgentesComponent }, 
  { path: 'edit-propiedad/:codigo', component: EditPropiedadComponent },
  { path: 'edit-propiedad', component: EditPropiedadComponent },
  { path: 'edit-agente/:id', component: EditAgenteComponent },
  { path: 'edit-agente', component: EditAgenteComponent },
  { path: 'cxc', component: CuentasPorCobrarComponent },
  { path: 'cxc/:p', component: CuentasPorCobrarComponent },
  { path: 'cxc/single/:clienteID', component: CuentasPorCobrarSingleComponent },
  { path: 'add-cliente', component: AddClienteComponent },
  { path: 'add-lugar', component: AddLugarComponent },
  { path: 'add-inquilino', component: AddInquilinoComponent },
  { path: 'edit-cliente', component: EditClienteComponent },
  { path: 'edit-lugar', component: EditLugarComponent },
  { path: 'edit-inquilino', component: EditInquilinoComponent },
  { path: 'asignar-lugar-cliente', component: AsignarLugarClienteComponent },
  { path: 'modulos-piso-lugar', component: DivisionesPisoLugarComponent },
  { path: 'lugar-inquilino', component: LugarInquilinoComponent },
  { path: 'deudas-inquilino', component: DeudasInquilinoComponent },
  { path: 'deudas-cliente', component: DeudasClienteComponent },
  { path: 'recibo-cliente', component: ReciboClienteComponent },
  { path: 'recibo-cliente/:clienteID', component: ReciboClienteComponent },
  { path: 'cuentas-inquilino', component: CuentasInquilinoComponent },
  { path: 'cuentas-inquilino/:p', component: CuentasInquilinoComponent },
  { path: 'facturar-inquilino', component: FacturarComponent },
  { path: 'facturar-inquilino/:inquilinoID', component: FacturarComponent },
  { path: 'facturar-inquilino/:inquilinoID/:piso/:division', component: FacturarComponent },
  { path: 'recibo-inquilino', component: ReciboInquilinoComponent },
  { path: 'recibo-inquilino/:inquilinoID', component: ReciboInquilinoComponent },
  { path: 'recibo-inquilino/:inquilinoID/:piso/:division', component: ReciboInquilinoComponent },
  { path: 'facturar-cliente', component: FacturarClienteComponent },
  { path: 'facturar-cliente/:clienteID', component: FacturarClienteComponent },
  { path: 'cuentas-clientes', component: ClientesCuentasComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/:p', component: UsuariosComponent },
  { path: 'cxp', component: CuentasPorPagarComponent },
  { path: 'cxp/:p', component: CuentasPorPagarComponent },
  { path: 'facturas-cliente', component: FacturasClienteComponent },
  { path: 'facturas-cliente/:p', component: FacturasClienteComponent },
  { path: 'facturas-inquilino', component: FacturasInquilinoComponent },
  { path: 'facturas-inquilino/:p', component: FacturasInquilinoComponent },
  { path: 'nominas', component: NominasComponent },
  { path: 'add-empleado', component: AddEmpleadoComponent },
  { path: 'edit-empleado', component: EditEmpleadoComponent },
  { path: 'nominas-pagos', component: NominasPagosComponent },
  { path: 'nomina', component: NominasNominaComponent }
  //{ path: 'user-log/:p', component: UserLogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
