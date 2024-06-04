import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { iMessageDto } from 'src/app/models/tickets/iMessageDto';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { MessageDataService } from 'src/app/services/tickets/messageData.service';
import { MessagesService } from 'src/app/services/tickets/messages.service';
import { MessagesUpdateService } from 'src/app/services/tickets/messagesUpdate.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { LocalStorageKeys, StorageRoutes } from 'src/app/utilities/literals';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatTooltipModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  ticketId: number = 0;
  messages: iMessageDto[] = [];
  ticket: iTicketDescriptor = {} as iTicketDescriptor;
  userName: string = '';
  private messagesUpdateSubscription: Subscription = {} as Subscription;

  constructor(private messagesService: MessagesService, private route: ActivatedRoute,
    private translate: TranslateService, private messagesUpdateService: MessagesUpdateService,
    private ticketsService: TicketsService, private messageDataService: MessageDataService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketId = +params['ticketId'];
      console.log("Ticket ID", this.ticketId);
      this.loadMessages();
    });
    this.loadTicket();

    this.messagesUpdateSubscription = this.messagesUpdateService.messagesUpdated$.subscribe(() => {
      this.loadMessages();
    });

    this.messageDataService.messages$.subscribe((messages: iMessageDto[]) => {
      this.messages = messages;
    });
  }

  ngOnDestroy(): void {
    if (this.messagesUpdateSubscription) {
      this.messagesUpdateSubscription.unsubscribe();
    }
  }

  private loadMessages() {
    this.messageDataService.getMessages(this.ticketId);
  }

  private loadTicket() {
    this.ticketsService.getTicketById(this.ticketId).subscribe({
      next: (response: iTicket) => {
        this.ticket = {
          id: response.id,
          title: response.title,
          name: response.name,
          email: response.email,
          timestamp: response.timestamp,
          priority: response.priority,
          status: response.status,
          userId: response.userId.toString(),
          userName: ""
        };
        this.userName = this.ticket.name;
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    });
  }

  reloadMessages() {
    this.loadMessages();
  }

  downloadAttachment(attachmentPath: string) {
    const pathPrefix = StorageRoutes.attachmentStorage + this.ticketId + '/';
    const fileName = attachmentPath.substring(pathPrefix.length);
    this.messagesService.downloadAttachment(fileName, this.ticketId).subscribe({
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
