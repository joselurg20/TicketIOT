import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { IncidenceDataComponent } from './components/incidences/incidence-data/incidence-data.component';
import { IncidenceIndexComponent } from './components/incidences/incidence-index/incidence-index.component';
import { IncidencePruebaComponent } from './components/incidences/incidence-prueba/incidence-prueba.component';
import { IncidenceTableComponent } from './components/incidences/incidence-table/incidence-table.component';
import { CloseComponent } from './components/login/close/close.component';
import { LoginComponent } from './components/login/login-index/login.component';
import { RecoveredComponent } from './components/login/recovered/recovered.component';
import { Recovery2Component } from './components/login/recovery2/recovery2.component';
import { HelpdeskComponent } from './components/messages/helpdesk/helpdesk.component';
import { HistoryComponent } from './components/messages/history/history.component';
import { MessageComponent } from './components/messages/message/message.component';
import { LoadingComponent } from './components/shared/loading.component';
import { TechnicalTableComponent } from './components/technical-table/technical-table.component';
import { IncidenceUserComponent } from './pages/incidence-user/incidence-user.component';
import { ManagerIncidenceComponent } from './pages/manager-incidence/manager-incidence.component';
import { SupportManagerComponent } from './pages/support-manager/support-manager.component';
import { SupportTechnicalComponent } from './pages/support-technical/support-technical.component';
import { TechnicialIncidenceComponent } from './pages/technicial-incidence/technicial-incidence.component';
import { managerGuard } from './guards/manager.guard';
import { technicianGuard } from './guards/technician.guard';


const routes: Routes = [

  //accesibles por los trabajadores
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "recover", component: RecoveredComponent },
  { path: "recover/:hash/:username/:domain/:tld", component: Recovery2Component },
  { path: "support-manager", component: SupportManagerComponent, canActivate: [managerGuard] },
  { path: "support-technician", component: SupportTechnicalComponent, canActivate: [technicianGuard] },
  { path: "review-manager", component: ManagerIncidenceComponent, canActivate: [managerGuard] },
  { path: "review-technician", component: TechnicialIncidenceComponent, canActivate: [technicianGuard] },

  //Pruebas 
  { path: "prueba", component: IncidenceTableComponent },
  { path: "prueba3/:ticketId", component: MessageComponent },
  { path: "prueba4", component: IncidencePruebaComponent },
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
