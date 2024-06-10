import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { iMessageDto } from 'src/app/models/tickets/iMessageDto';
import { MessageDataService } from 'src/app/services/tickets/messageData.service';
import { MessagesService } from 'src/app/services/tickets/messages.service';
import { MessagesUpdateService } from 'src/app/services/tickets/messagesUpdate.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LocalStorageKeys, Roles, StorageRoutes } from 'src/app/utilities/literals';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  ticketId: number = 0;
  ticket: TicketDto = { name: '', email: '', title: '', hasNewMessages: false, newMessagesCount: 0 };
  messages: iMessageDto[] = [];
  private messagesUpdateSubscription: Subscription = Subscription.EMPTY;
  messageSubscription: Subscription = Subscription.EMPTY;

  constructor(private messagesService: MessagesService, private translate: TranslateService,
              private messagesUpdateService: MessagesUpdateService, private ticketsService: TicketsService,
              private usersService: UsersService, private messageDataService: MessageDataService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  ngOnInit(): void {
    var ticketIdLS = localStorage.getItem(LocalStorageKeys.selectedTicket);
    if (ticketIdLS != null) {
      this.ticketId = +ticketIdLS;
    }
    if (this.ticketId) {
      this.messageDataService.getMessages(this.ticketId);

      this.messagesUpdateSubscription = this.messagesUpdateService.messagesUpdated$.subscribe(() => {
        
        this.messageDataService.getMessages(this.ticketId);
      });
      this.messageSubscription = this.messageDataService.messages$.subscribe((messages: iMessageDto[]) => {
        this.messages = messages;
      });
    }
  }

  ngOnDestroy() {
    this.messagesUpdateSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

  /**
   * Marca los mensajes de una incidencia como leídos.
   */
  readMessages() {
    this.ticketsService.getTicketById(this.ticketId).subscribe({
      next: (response: TicketDto) => {
        const ticket: TicketDto = {
          title: response.title,
          name: response.name,
          email: response.email,
          hasNewMessages: false,
          newMessagesCount: 0
        }
        this.ticket = ticket;
        if(this.usersService.currentUser?.role === Roles.technicianRole){
          
          this.ticketsService.updateTicket(this.ticketId, this.ticket).subscribe({
            next: (response: any) => {
            },
            error: (error: any) => {
              console.error('Error al actualizar el ticket', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    });
  }

  /**
   * Descarga un archivo adjunto del servidor.
   * @param attachmentPath la ruta del archivo.
   */
  downloadAttachment(attachmentPath: string) {
    var pathPrefix = StorageRoutes.attachmentStorage + this.ticketId + '/';
    const fileName = attachmentPath.substring(pathPrefix.length);
    this.messagesService.downloadAttachment(fileName, +localStorage.getItem(LocalStorageKeys.selectedTicket)!).subscribe({
      next: (response: BlobPart) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    })
  }
}
