import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iMessage } from 'src/app/models/tickets/iMessage';



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
