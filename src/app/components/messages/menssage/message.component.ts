import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { iAttachment } from 'src/app/models/attachments/iAttachment';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  ticketId: number = 0;
  ticket: TicketDto = {Name: '', Email: '', Title: '', HasNewMessages: false, NewMessagesCount: 0};
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
              Author: message.author,
              Content: message.content,
              AttachmentPaths: message.attachmentPaths.$values.map((attachmentPath: any) => attachmentPath.path),
              Attachments: [],
              ticketID: message.ticketID,
              Timestamp: this.formatDate(message.timestamp)
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
          HasNewMessages: false,
          NewMessagesCount: 0
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
    
    
    for (const message of this.messages) {
      if(message.AttachmentPaths.length > 0) {
        for (const attachmentPath of message.AttachmentPaths) {
          var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/'+this.ticketId+'/';
          const fileName = attachmentPath.substring(pathPrefix.length);
          this.apiService.downloadAttachment(fileName, +localStorage.getItem('selectedTicket')!).subscribe({
            next: (response: any) => {
              const attachment: iAttachment = {
                attachmentPath: attachmentPath,
                attachmentUrl: URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }))
              }
              message.Attachments.push(attachment);
            },
            error: (error: any) => {
              console.error('Error al descargar el archivo adjunto', error);
            }
          })
        }
        console.log('Mensajes', this.messages);
      }
    }
  }

  downloadAttachment(attachmentPath: string) {
    var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/'+this.ticketId+'/';
    const fileName = attachmentPath.substring(pathPrefix.length);
    this.apiService.downloadAttachment(fileName, +localStorage.getItem('selectedTicket')!).subscribe({
      next: (response: any) => {
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

  formatDate(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    const segundos = fechaObj.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} - ${horas}:${minutos}:${segundos}`;
  }
}
