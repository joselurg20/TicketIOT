import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { IncidenceDataComponent } from './components/incidences/incidence-data/incidence-data.component';
import { IncidenceIndexComponent } from './components/incidences/incidence-index/incidence-index.component';
import { IncidenceTableComponent } from './components/incidences/incidence-table/incidence-table.component';
import { CloseComponent } from './components/login/close/close.component';
import { LoginComponent } from './components/login/login-index/login.component';
import { RecoveredComponent } from './components/login/recovered/recovered.component';
import { Recovery2Component } from './components/login/recovery2/recovery2.component';
import { HelpdeskComponent } from './components/messages/helpdesk/helpdesk.component';
import { HistoryComponent } from './components/messages/history/history.component';
import { MessageComponent } from './components/messages/message/message.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { TechnicalTableComponent } from './components/technical-table/technical-table.component';
import { managerGuard } from './guards/manager.guard';
import { technicianGuard } from './guards/technician.guard';
import { IncidenceUserComponent } from './pages/incidence-user/incidence-user.component';
import { ManagerIncidenceComponent } from './pages/manager-incidence/manager-incidence.component';
import { SupportManagerComponent } from './pages/support-manager/support-manager.component';
import { SupportTechnicalComponent } from './pages/support-technical/support-technical.component';
import { reviewGuard } from './guards/review.guard';
import { BaseLayoutComponent } from './components/shared/base-layout/base-layout.component';
import { SiteLayoutComponent } from './components/shared/site-layout/site-layout.component';


const routes: Routes = [

  /*
  
  {
    path: "", component: BaseLayoutComponent, children: [ //Rutas sin sidenav
      { path: "", component: LoginComponent },
      { path: "login", component: LoginComponent },
      { path: "recover", component: RecoveredComponent },
      { path: "incidence", component: IncidenceIndexComponent },
      { path: "link/:hashedId/:ticketId", component: IncidenceUserComponent },
      { path: "cls", component: CloseComponent },
    ]
  },

  {
    path: "manager", component: SiteLayoutComponent, canActivate: [managerGuard, reviewGuard, technicianGuard], canActivateChild: [managerGuard, reviewGuard, technicianGuard], 
    children: [ //Rutas con sidenav      
      { path: "review", component: ManagerIncidenceComponent },
      { path: "support-manager", component: SupportManagerComponent },
      { path: "support-technician", component: SupportTechnicalComponent },
      { path: "incidence", component: IncidenceIndexComponent },
    ]
  },

  //preguntar a ciscu
  { path: "recover/:hash/:username/:domain/:tld", component: Recovery2Component },

  //Pagina de 404/Not Found

  { path: "404", component: Error404Component },
  { path: "**", redirectTo: "/404" },

*/

  //accesibles por los trabajadores
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "recover", component: RecoveredComponent },
  { path: "recover/:hash/:username/:domain/:tld", component: Recovery2Component },
  { path: "support-manager", component: SupportManagerComponent, canActivate: [managerGuard] },
  { path: "support-technician", component: SupportTechnicalComponent, canActivate: [technicianGuard] },
  { path: "review", component: ManagerIncidenceComponent, canActivate: [reviewGuard] },

  //Pruebas 
  { path: "prueba", component: IncidenceTableComponent },
  { path: "prueba2", component: ManagerIncidenceComponent },
  { path: "prueba3/:ticketId", component: MessageComponent },
  { path: "prueba5", component: TechnicalTableComponent },
  { path: "prueba6/:ticketId", component: HistoryComponent },
  { path: "prueba7", component: HelpdeskComponent },
  { path: "prueba8", component: LoadingComponent },
  { path: "prueba9", component: IncidenceDataComponent },
  { path: "enlace", component: IncidenceUserComponent },
  { path: "recuperar", component: RecoveredComponent },
  { path: "recuperar2", component: Recovery2Component },



  //accesibles por el usuario
  { path: "incidence", component: IncidenceIndexComponent },
  { path: "cls", component: CloseComponent },
  { path: "link/:hashedId/:ticketId", component: IncidenceUserComponent },
  { path: "404", component: Error404Component },
  { path: "**", redirectTo: "/404" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
