import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { inject } from '@angular/core';
import { Roles } from '../utilities/literals';
import { LoginService } from '../services/users/login.service';
import { Routes } from '../utilities/routes';
import { ComponentLoadService } from '../services/componentLoad.service';

export const technicianGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const usersService = inject(UsersService);
  const router = inject(Router);
  const trigger = inject(ComponentLoadService);

  let response = true;

  if(loginService.isLogged()){

    trigger.loadComponent$.subscribe(() => {
     
      if (usersService.currentUser?.role !== Roles.technicianRole) {
        response = false;
        router.navigate([Routes.login]);
      }
    });
    
  }else{
    response = false;
    router.navigate([Routes.login]);
  }
  return response;
};
