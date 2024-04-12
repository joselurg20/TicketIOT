import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesUpdateService {
  private messagesUpdatedSource = new Subject<void>();

  messagesUpdated$ = this.messagesUpdatedSource.asObservable();

  /**
   * Trigger the ticket update.
   */
  triggerMessagesUpdate() {
    console.log('Messages update triggered')
    this.messagesUpdatedSource.next();
  }
}