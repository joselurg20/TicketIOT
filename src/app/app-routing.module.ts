import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { LoginComponent } from './components/login/login-index/login.component';
import { IncidenceIndexComponent } from './components/incidences/incidence-index/incidence-index.component';
import { RecoveredComponent } from './components/login/recovered/recovered.component';
import { SupportManagerComponent } from './pages/support-manager/support-manager.component';
import { HelpdeskComponent } from './components/messages/helpdesk/helpdesk.component';
import { IncidenceUserComponent } from './pages/incidence-user/incidence-user.component';
import { TechnicialIncidenceComponent } from './pages/technicial-incidence/technicial-incidence.component';
import { SupportTechnicalComponent } from './pages/support-technical/support-technical.component';
import { ManagerIncidenceComponent } from './pages/manager-incidence/manager-incidence.component';
import { TechnicalTableComponent } from './components/technical-table/technical-table.component';


const routes: Routes = [

  //accedibles por los trabajadores
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "recuperar", component: RecoveredComponent },
  { path: "support-manager", component: SupportManagerComponent },
  { path: "support-technician", component: SupportTechnicalComponent },
  { path: "revisar-manager", component: ManagerIncidenceComponent },
  { path: "revisar-tecnico", component: TechnicialIncidenceComponent },
  { path: "helpdesk/:ticketId", component: HelpdeskComponent },
  { path: "prueba", component: TechnicalTableComponent },

  //accedibles el usuario
  { path: "incidencia", component: IncidenceIndexComponent },
  { path: "enlace", component: IncidenceUserComponent },
  { path: "404", component: Error404Component },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
