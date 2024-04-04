import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { timestamp } from 'rxjs';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  ticketId: number = 0;
  ticket: TicketDto = {Name: '', Email: '', Title: '', HasNewMessages: false};
  messages: iMessage[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    var ticketIdLS = localStorage.getItem('selectedTicket');
    if (ticketIdLS != null) {
      this.ticketId = +ticketIdLS;
    }
    console.log('ticketId', this.ticketId);
    if (this.ticketId) {
      this.apiService.getMessagesByTicket(this.ticketId).subscribe({
        next: (response: any) => {
          console.log('response', response);
          this.messages = response.$values.map((message: any) => {
            return {
              Id: message.id,
              Content: message.content,
              AttachmentPaths: message.attachmentPaths.$values.map((attachmentPath: any) => attachmentPath.path),
              ticketID: message.ticketID,
              Timestamp: message.timestamp
            }
          })
        },
        error: (error: any) => {
          console.error('Error al obtener los mensajes del ticket', error);
        }
      });
    }
  }

  readMessages() {
    this.apiService.getTicketById(this.ticketId).subscribe({
      next: (response: any) => {
        const ticket: TicketDto = {
          Title: response.title,
          Name: response.name,
          Email: response.email,
          HasNewMessages: false
        }
        this.ticket = ticket;
        this.apiService.updateTicket(this.ticketId, this.ticket).subscribe({
          next: (response: any) => {
            console.log('Ticket actualizado', response);
          },
          error: (error: any) => {
            console.error('Error al actualizar el ticket', error);
          }
        })
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    });    
  }

  downloadAttachment(attachmentPath: string) {
    var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/'+this.ticketId+'/';
    const fileName = attachmentPath.substring(pathPrefix.length);
    this.downloadFile(attachmentPath, fileName);
  }

  downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    link.click();

    window.URL.revokeObjectURL(url);
  }
}
