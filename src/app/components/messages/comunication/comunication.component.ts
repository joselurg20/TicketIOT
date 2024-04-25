import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { ApiService } from 'src/app/services/api.service';
import { MessagesUpdateService } from 'src/app/services/messagesUpdate.service';
import { SnackbarMenssageComponent } from '../../snackbars/snackbar-menssage/snackbar-menssage.component';
import { MessageComponent } from "../menssage/message.component";

@Component({
  selector: 'app-comunication',
  standalone: true,
  imports: [CommonModule, MessageComponent, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss']
})
export class ComunicationComponent implements OnInit {

  public messageForm!: FormGroup;
  public ticket: iTicketDescriptor = {} as iTicketDescriptor;
  public success: boolean = true;
  successMsg: string = '';
  public userName: string = '';
  selectedFiles: File[] = [];
  durationInSeconds = 3;
  public selectFilesNames: string[] = [];


  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, private translate: TranslateService, private formBuilder: FormBuilder, private messagesUpdateService: MessagesUpdateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
    this.messageForm = this.formBuilder.group({
      Attachments: [null, Validators.required],
      Content: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      Attachments: new FormControl('', null),
      Content: new FormControl('', Validators.required)
    });
    const selectedTicket = localStorage.getItem('selectedTicket');
    if (selectedTicket != null) {
      this.apiService.getTicketById(+selectedTicket).subscribe({
        next: (response: any) => {
          this.ticket = {
            id: response.id,
            title: response.title,
            name: response.name,
            email: response.email,
            timestamp: this.formatDate(response.timestamp),
            priority: response.priority,
            state: response.state,
            userId: response.userId,
            userName: ''
          };
        },
        error: (error: any) => {
          console.error('Error al obtener el ticket', error);
        }
      });
    }

    this.apiService.getUserById(parseInt(localStorage.getItem('userId')!)).subscribe({
      next: (response: any) => {
        this.userName = response.fullName;
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario', error);
      }
    })
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarMenssageComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  previewUrls: Array<string | ArrayBuffer | null> = new Array();
  isFileSelected: boolean = false;

  /**
  * Envía un mensaje a la incidencia seleccionada.
  */
  onSubmit() {
    if (this.ticket.state !== 'FINISHED') {
      if (this.messageForm.valid) {
        const Content = this.messageForm.value.Content;
        this.createMessage(Content, this.ticket.id)
          .subscribe({
            next: (response) => {
              this.success = true;
              this.messagesUpdateService.triggerMessagesUpdate();
              this.messageForm.reset();
              this.openSnackBar();

            },
            error: (error) => {
              console.error('Error en la solicitud', error);
              this.success = false;
              this.successMsg = "Error al crear el mensaje.";
            }
          });

      }
    } else {
      this.successMsg = "El ticket ya ha sido cerrado.";
    }
  }

  /**
  * Crea un mensaje nuevo para la incidencia cuyo id se pasa como parámetro.
  * @param Content el contenido del mensaje.
  * @param TicketId el id de la incidencia.
  * @returns 
  */
  createMessage(Content: string, TicketId: number): Observable<any> {
    const formData = new FormData();
    formData.append('Author', this.userName);
    formData.append('Content', Content);
    formData.append('TicketId', TicketId.toString());

    this.apiService.getTicketById(TicketId).subscribe({
      next: (response: any) => {
        var ticket: TicketDto = {
          Title: response.title,
          Name: response.name,
          Email: response.email,
          HasNewMessages: true,
          NewMessagesCount: response.newMessagesCount
        };
        ticket.NewMessagesCount++;
        this.apiService.updateTicket(TicketId, ticket).subscribe({
          error: (error: any) => {
            console.error('Error al actualizar el ticket', error);
          }
        })
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    })

    var attachments = this.selectedFiles;

    if (attachments.length > 0) {

      if (attachments.length == 1) {
        const fileInput = <HTMLInputElement>document.getElementById('Attachments');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          formData.append('Attachments', fileInput.files[0], fileInput.files[0].name);
        }
      } else if (attachments.length > 0) {
        for (var attachment of attachments) {
          formData.append('Attachments', attachment, attachment.name);
        }
      }
    }
    this.selectedFiles = [];
    this.previewUrls = new Array();
    this.isFileSelected = false;
    return this.apiService.createMessage(formData);
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

  isImage(previewUrl: string | ArrayBuffer | null): boolean {
    if (typeof previewUrl === 'string' && previewUrl.startsWith('data:image')) {
      return true;
    }
    return false;
  }


  /**
  * Actualiza la previsualización de un archivo adjunto.
  * @param event el evento que lanza la función.
  */


  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
    const files = this.selectedFiles;
    this.isFileSelected = true;
    for (let file of files) {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // Verificar el tipo de archivo
          if (file.type) {

            switch (file.type) {
              case 'image/jpeg':
              case 'image/png':
              case 'image/gif':
                this.previewUrls.push(reader.result);
                break;
              case 'application/pdf':
                // Asignar una imagen para PDF
                this.previewUrls.push('assets/images/file-previews/pdf_file.png');
                break;
              case 'application/msword':
              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                // Asignar una imagen para Word
                this.previewUrls.push('assets/images/file-previews/doc_file.png');
                break;
              case 'application/vnd.ms-excel':
              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                // Asignar una imagen para Excel
                this.previewUrls.push('assets/images/file-previews/xls_file.png');
                break;
              case 'text/plain':
                // Asignar una imagen para archivos de texto
                this.previewUrls.push('assets/images/file-previews/txt_file.png');
                break;
              case 'application/x-compressed':
              case 'application/x-zip-compressed':
              case 'application/x-7z-compressed':
                // Asignar una imagen para archivos comprimidos
                this.previewUrls.push('assets/images/file-previews/rar_file.png');
                break;
              case 'audio/mpeg':
              case 'audio/wav':
                // Asignar una imagen para archivos de audio
                this.previewUrls.push('assets/images/file-previews/audio_file.png');
                break;
              case 'video/mp4':
              case 'video/avi':
              case 'video/x-matroska':
                // Asignar una imagen para archivos de video
                this.previewUrls.push('assets/images/file-previews/video_file.png');
                break;
              default:
                // Asignar una imagen por defecto para otros tipos de archivo
                this.previewUrls.push('assets/images/file-previews/unknown_file.png');
            }
          }
          this.selectFilesNames.push(file.name);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
