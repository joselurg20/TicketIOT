import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { ActivatedRoute } from '@angular/router';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';



@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  ticketId: number = 0;
  messages: iMessage[] = [];
  ticket: any;
  userName: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

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
              Timestamp: this.formatDate(message.timestamp),
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
