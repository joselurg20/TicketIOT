import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { iMessage } from "src/app/models/tickets/iMessage";
import { MessagesService } from "./messages.service";
import { Utils } from "src/app/utilities/utils";
import { iAttachment } from "src/app/models/attachments/iAttachment";
import { iMessageDto } from "src/app/models/tickets/iMessageDto";

@Injectable({
    providedIn: 'root'
  })
  export class MessageDataService {
    
    messages: iMessageDto[] = [];

    private messagesSubject: BehaviorSubject<iMessageDto[]> = new BehaviorSubject<iMessageDto[]>([]);
    messages$: Observable<iMessageDto[]> = this.messagesSubject.asObservable();
    
  
    constructor(private messagesService: MessagesService) { }

    getMessages(ticketId: number) {
        this.messagesService.getMessagesByTicket(ticketId).subscribe({
            next: (response: iMessage[]) => {
              this.messages = response.map((message: iMessage) => {
                return {
                  id: message.id,
                  author: message.author,
                  content: message.content,
                  attachmentPaths: message.attachmentPaths.map((attachmentPath: iAttachment) => attachmentPath.path),
                  attachments: [],
                  ticketID: message.ticketID,
                  timestamp: Utils.formatDate(message.timestamp)
                }
              });
      
              // Archivos adjuntos
              for (const message of this.messages) {
                if (message.attachmentPaths.length > 0) {
                  for (const attachmentPath of message.attachmentPaths) {
                    var pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/' + ticketId + '/';
                    const fileName = attachmentPath.substring(pathPrefix.length);
                    this.messagesService.downloadAttachment(fileName, ticketId).subscribe({
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

              this.messagesSubject.next(this.messages);
            },
            error: (error: any) => {
              console.error('Error al obtener los mensajes del ticket', error);
            }
          });
    }
  }