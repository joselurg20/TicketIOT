import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  routeChange: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() { }
  setNavigationRoute(navigationRoute: string) {
    this.routeChange.next(navigationRoute);
  }
}
