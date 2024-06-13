import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ComponentLoadService } from '../services/componentLoad.service';
import { LoginService } from '../services/users/login.service';
import { UsersService } from '../services/users/users.service';
import { Roles } from '../utilities/literals';
import { Routes } from '../utilities/routes';

export const technicianGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const usersService = inject(UsersService);
  const router = inject(Router);
  const trigger = inject(ComponentLoadService);

  let response = true;

  if (loginService.isLogged()) {

    trigger.loadComponent$.subscribe(() => {

      if (usersService.currentUser?.role !== Roles.technicianRole) {
        response = false;
        router.navigate([Routes.login]);
      }
    });

  } else {
    response = false;
    router.navigate([Routes.login]);
  }
  return response;
};
