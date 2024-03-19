import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { LoginComponent } from './components/login/login-index/login.component';
import { IncidenceIndexComponent } from './components/incidences/incidence-index/incidence-index.component';
import { RecoveredComponent } from './components/login/recovered/recovered.component';
import { IncidencesReviewComponent } from './components/incidences/incidences-review/incidences-review.component';


const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "recuperar", component: RecoveredComponent},
  {path: "revisar", component: IncidencesReviewComponent},
  {path: "incidencia", component:IncidenceIndexComponent },
  {path: "404", component: Error404Component},
  {path: "**", redirectTo: "/404"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
