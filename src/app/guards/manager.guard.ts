import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/users/login.service';
import { UsersService } from '../services/users/users.service';
import { Roles } from '../utilities/literals';
import { Routes } from '../utilities/routes';

export const managerGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const usersService = inject(UsersService);
  const router = inject(Router);

  let response = true;

  if(loginService.isLogged()){

    setTimeout(() => {
     
    if (usersService.currentUser?.role !== Roles.managerRole) {
      response = false;
      router.navigate([Routes.login]);
    } 
    },1)
    
  }else{
    response = false;
    router.navigate([Routes.login]);
  }
  return response;
};
