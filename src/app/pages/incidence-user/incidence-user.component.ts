import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { MessageComponent } from "../../components/messages/menssage/message.component";
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { HelpdeskComponent } from "../../components/messages/helpdesk/helpdesk.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { HistoryComponent } from "../../components/messages/history/history.component";
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';

@Component({
    selector: 'app-incidence-user',
    standalone: true,
    templateUrl: './incidence-user.component.html',
    styleUrls: ['./incidence-user.component.scss'],
    imports: [CommonModule, MatGridListModule, NgFor, IncidenceTableComponent, IncidenceDataComponent, MessageComponent, HelpdeskComponent, ComunicationComponent, HistoryComponent]
})
export class IncidenceUserComponent {
  public messages: iMessage[] = [];
  successMsg: string = "";
  ticketId: number = 0;
  public ticket = {} as iTicketDescriptor;
  public userName: string = '';
  
  
    constructor(private route: ActivatedRoute, private apiService: ApiService) { }
  
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.ticketId = params['ticketId'];
        console.log('TicketId', this.ticketId)
        this.apiService.getMessagesByTicket(this.ticketId).subscribe({
          next: (response: any) => {
            console.log('response', response);
            this.messages = response.$values.map((message: any) => {
              return {
                Id: message.id,
                Author: message.author,
                Content: message.content,
                AttachmentPaths: message.attachmentPaths.$values.map((attachmentPath: any) => attachmentPath.path),
                ticketID: message.ticketId
              }
            })
          },
          error: (error: any) => {
            console.error('Error al obtener los mensajes del ticket', error);
          }
        })
      });
      this.apiService.getTicketById(this.ticketId).subscribe({
        next: (response: any) => {
          this.ticket = {
            id: response.id,
            title: response.title,
            name: response.name,
            email: response.email,
            timestamp: response.timestamp,
            priority: response.priority,
            state: response.state,
            userId: response.userId,
            userName: ""
          }
          this.userName = this.ticket.name;
        },
        error: (error: any) => {
          console.error('Error al obtener el usuario', error);
        }
      });
    }
}
