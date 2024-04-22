import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageUpdateService {
  private langUpdatedSource = new Subject<void>();

  langUpdated$ = this.langUpdatedSource.asObservable();

  /**
   * Trigger the graph update.
   */
  triggerGraphUpdate() {
    this.langUpdatedSource.next();
  }
}