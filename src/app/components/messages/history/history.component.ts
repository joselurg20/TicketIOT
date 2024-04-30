import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MessageJsonResult } from 'src/app/models/JsonResult';
import { iAttachment } from 'src/app/models/attachments/iAttachment';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { iMessageDto } from 'src/app/models/tickets/iMessageDto';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { MessagesService } from 'src/app/services/tickets/messages.service';
import { MessagesUpdateService } from 'src/app/services/tickets/messagesUpdate.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';



@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  ticketId: number = 0;
  messages: iMessageDto[] = [];
  ticket: iTicketDescriptor = {} as iTicketDescriptor;
  userName: string = '';
  private messagesUpdateSubscription: Subscription = {} as Subscription;

  constructor(private messagesService: MessagesService, private route: ActivatedRoute,
              private translate: TranslateService, private messagesUpdateService: MessagesUpdateService,
              private ticketsService: TicketsService) {
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
      this.ticketId = params['ticketId'];
      this.refreshMessagesData();
    });
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
        }
        this.userName = this.ticket.name;
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario', error);
      }
    });
    this.messagesUpdateSubscription = this.messagesUpdateService.messagesUpdated$.subscribe(() => {
      
      this.refreshMessagesData();
    });
  }

  /**
   * Actualiza los mensajes de la incidencia.
   */
  refreshMessagesData() {
    this.messagesService.getMessagesByTicket(this.ticketId).subscribe({
      next: (response: MessageJsonResult) => {
        this.messages = response.$values.map((message: iMessage) => {
          return {
            id: message.id,
            author: message.author,
            content: message.content,
            attachmentPaths: message.attachmentPaths.$values.map((attachmentPath: iAttachment) => attachmentPath.path),
            attachments: [],
            ticketID: message.ticketID,
            timestamp: this.formatDate(message.timestamp)
          }
        });

        // Archivos adjuntos
        for (const message of this.messages) {
          if (message.attachmentPaths.length > 0) {
            for (const attachmentPath of message.attachmentPaths) {
              var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/' + this.ticketId + '/';
              const fileName = attachmentPath.substring(pathPrefix.length);
              this.messagesService.downloadAttachment(fileName, +localStorage.getItem('selectedTicket')!).subscribe({
                next: (response: BlobPart) => {
                  var attachment: iAttachment = {} as iAttachment;
                  attachment.path = attachmentPath;
                  attachment.attachmentUrl = URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }));
                  if(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')){

                    attachment.previewUrl = URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }))

                  } else if(fileName.endsWith('.pdf')){

                    attachment.previewUrl = 'assets/images/file-previews/pdf_file.png'

                  } else if(fileName.endsWith('.doc') || fileName.endsWith('.docx')){

                    attachment.previewUrl = 'assets/images/file-previews/doc_file.png'

                  } else if(fileName.endsWith('.xls') || fileName.endsWith('.xlsx')){

                    attachment.previewUrl = 'assets/images/file-previews/xls_file.png'
                      
                  } else if(fileName.endsWith('.rar') || fileName.endsWith('.zip') || fileName.endsWith('.7z')){

                    attachment.previewUrl = 'assets/images/file-previews/rar_file.png'
                      
                  } else if(fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.mpeg')){

                    attachment.previewUrl = 'assets/images/file-previews/audio_file.png'
                      
                  } else if(fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mkv')){

                    attachment.previewUrl = 'assets/images/file-previews/video_file.png'
                      
                  } else if(fileName.endsWith('.txt')){

                    attachment.previewUrl = 'assets/images/file-previews/txt_file.png'

                  } else {
                    attachment.previewUrl = 'assets/images/file-previews/unknown_file.png'
                  }
                  message.attachments.push(attachment);
                },
                error: (error: any) => {
                  console.error('Error al descargar el archivo adjunto', error);
                }
              })
            }
          }
        
      }
      },
      error: (error: any) => {
        console.error('Error al obtener los mensajes del ticket', error);
      }
    });
  }

  /**
   * Descarga un archivo del servidor.
   * @param attachmentPath la ruta del archivo.
   */
  downloadAttachment(attachmentPath: string) {
    var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/' + this.ticketId + '/';
    const fileName = attachmentPath.substring(pathPrefix.length);
    this.messagesService.downloadAttachment(fileName, +localStorage.getItem('selectedTicket')!).subscribe({
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

  /**
   * Da formato a la fecha.
   * @param fecha la fecha a formatear.
   * @returns la fecha con formato 'DD/MM/AAAA - HH:mm:ss'
   */
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
