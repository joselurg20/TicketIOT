import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './componets/error404/error404.component';
import { LoginComponent } from './componets/login/login-index/login.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "404", component: Error404Component},
  {path: "**", redirectTo: "/404"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
