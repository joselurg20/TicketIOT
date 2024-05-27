import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { IncidenceIndexComponent } from './components/incidences/incidence-index/incidence-index.component';
import { CloseComponent } from './components/login/close/close.component';
import { LoginComponent } from './components/login/login-index/login.component';
import { RecoveredComponent } from './components/login/recovered/recovered.component';
import { Recovery2Component } from './components/login/recovery2/recovery2.component';
import { BaseLayoutComponent } from './components/shared/base-layout/base-layout.component';
import { SiteLayoutComponent } from './components/shared/site-layout/site-layout.component';
import { reviewGuard } from './guards/review.guard';
import { IncidenceUserComponent } from './pages/incidence-user/incidence-user.component';
import { ManagerIncidenceComponent } from './pages/manager-incidence/manager-incidence.component';
import { SupportManagerComponent } from './pages/support-manager/support-manager.component';
import { SupportTechnicalComponent } from './pages/support-technical/support-technical.component';


const routes: Routes = [
  
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
    path: "manager", component: SiteLayoutComponent, canActivate: [reviewGuard], children: [ //Rutas con sidenav   
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
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
