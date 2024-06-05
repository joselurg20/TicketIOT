import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoadService {
  private loadComponentSource = new Subject<void>();

  loadComponent$ = this.loadComponentSource.asObservable();

  /**
   * Trigger the ticket update.
   */
  triggerComponentLoad() {
    this.loadComponentSource.next();
  }
}