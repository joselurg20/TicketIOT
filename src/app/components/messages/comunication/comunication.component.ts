import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { MessagesService } from 'src/app/services/tickets/messages.service';
import { MessagesUpdateService } from 'src/app/services/tickets/messagesUpdate.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';
import { Utils } from 'src/app/utilities/utils';
import { AlertComponent } from '../../snackbars/alert/alert.component';
import { SnackbarIncidenceComponent } from '../../snackbars/snackbar-incidence/snackbar-incidence.component';
import { MessageComponent } from "../message/message.component";

@Component({
  selector: 'app-comunication',
  standalone: true,
  imports: [CommonModule, MessageComponent, FormsModule, ReactiveFormsModule, TranslateModule , MatTooltipModule],
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss']
})
export class ComunicationComponent implements OnInit {

  public messageForm!: FormGroup;
  public ticket: iTicketDescriptor = {} as iTicketDescriptor;
  public success: boolean = true;
  successMsg: string = '';
  public userName: string | null = '';
  selectedFiles: File[] = [];
  durationInSeconds = 3;
  public selectFilesNames: string[] = [];
  currentIndex: number = 0;



  constructor(private messagesService: MessagesService, private _snackBar: MatSnackBar,
    private translate: TranslateService, private formBuilder: FormBuilder,
    private messagesUpdateService: MessagesUpdateService, private ticketsService: TicketsService,
    private usersService: UsersService) {
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
    const selectedTicket = localStorage.getItem(LocalStorageKeys.selectedTicket);
    if (selectedTicket != null) {
      this.ticketsService.getTicketById(+selectedTicket).subscribe({
        next: (response: iTicket) => {
          this.ticket = {
            id: response.id,
            title: response.title,
            name: response.name,
            email: response.email,
            timestamp: Utils.formatDate(response.timestamp),
            priority: response.priority,
            status: response.status,
            userId: response.userId.toString(),
            userName: ''
          };
        },
        error: (error: any) => {
          console.error('Error al obtener el ticket', error);
        }
      });
    }

    this.usersService.getUserById(this.usersService.currentUser?.id!).subscribe({
      next: (response: iUserGraph) => {
        this.userName = response.fullName;
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario', error);
      }
    })
  }

  openSnackBar() {
    if (this.messageForm.valid) {
      this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
        duration: this.durationInSeconds * 1000,
      });
    } else {
      this._snackBar.openFromComponent(AlertComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
  }

  previewUrls: Array<string | ArrayBuffer | null> = new Array();
  isFileSelected: boolean = false;

  /**
  * Envía un mensaje a la incidencia seleccionada.
  */
  onSubmit() {
    if (this.ticket.status !== 3) {
      if (this.messageForm.valid) {
        const Content = this.messageForm.value.Content;
        this.createMessage(Content, this.ticket.id)
          .subscribe({
            next: (response) => {
              this.success = true;
              this.messagesUpdateService.triggerMessagesUpdate();
              this.messageForm.reset();
              this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
                duration: this.durationInSeconds * 1000,
              });

            },
            error: (error) => {
              this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
                duration: this.durationInSeconds * 1000,
              });
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
    formData.append('Author', this.userName!);
    formData.append('Content', Content);
    formData.append('TicketId', TicketId.toString());

    if (this.usersService.currentUser?.id && this.usersService.currentUser.role === Roles.technicianRole) {
      formData.append('IsTechnician', 'true');
    } else {
      formData.append('IsTechnician', 'false');
    }

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
    return this.messagesService.createMessage(formData);
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

  deleteFile(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectFilesNames.splice(index, 1);
    if (this.previewUrls.length == 0) {
      this.isFileSelected = false;
    }
  }

  nextFile() {
    if (this.currentIndex < this.previewUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevFile() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.previewUrls.length - 1;
    }
  }


  truncateFileName(fileName: string, maxLength: number): string {
    if (fileName.length > maxLength) {
      return fileName.substr(0, maxLength) + '...';
    }
    return fileName;
  }
}
