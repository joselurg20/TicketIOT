import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphUpdateService {
  private graphUpdatedSource = new Subject<void>();

  graphUpdated$ = this.graphUpdatedSource.asObservable();

  triggerGraphUpdate() {
    console.log('Ticket update triggered')
    this.graphUpdatedSource.next();
  }
}