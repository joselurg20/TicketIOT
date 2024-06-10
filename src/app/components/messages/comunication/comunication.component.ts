import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
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
export class ComunicationComponent implements OnInit, OnDestroy {

  public messageForm!: FormGroup;
  public ticket: iTicketDescriptor = {} as iTicketDescriptor;
  public success: boolean = true;
  successMsg: string = '';
  public userName: string | null = '';
  selectedFiles: File[] = [];
  durationInSeconds = 3;
  public selectFilesNames: string[] = [];
  currentIndex: number = 0;

  ticketsSubscription: Subscription = Subscription.EMPTY;
  usersSubscription: Subscription = Subscription.EMPTY;



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
      this.ticketsSubscription = this.ticketsService.getTicketById(+selectedTicket).subscribe({
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

    this.usersSubscription = this.usersService.getUserById(+localStorage.getItem("loggedUser")!).subscribe({
      next: (response: iUserGraph) => {
        this.userName = response.fullName;
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario', error);
      }
    })
  }

  ngOnDestroy() {
    this.ticketsSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
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
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles = files;
    this.isFileSelected = files.length > 0;
    this.previewUrls = [];
    this.selectFilesNames = [];
  
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        let previewUrl: string | ArrayBuffer | null = reader.result;
  
        switch (file.type) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
            // Imágenes: mantener el reader.result como previewUrl
            break;
          case 'application/pdf':
            // PDF: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/pdf_file.png';
            break;
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            // Documentos de Word: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/doc_file.png';
            break;
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            // Documentos de Excel: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/xls_file.png';
            break;
          case 'text/plain':
            // Archivos de texto: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/txt_file.png';
            break;
          case 'application/x-compressed':
          case 'application/x-zip-compressed':
          case 'application/x-7z-compressed':
            // Archivos comprimidos: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/rar_file.png';
            break;
          case 'audio/mpeg':
          case 'audio/wav':
            // Archivos de audio: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/audio_file.png';
            break;
          case 'video/mp4':
          case 'video/avi':
          case 'video/x-matroska':
            // Archivos de video: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/video_file.png';
            break;
          default:
            // Otros tipos de archivo: Asignar una imagen por defecto
            previewUrl = 'assets/images/file-previews/unknown_file.png';
            break;
        }
  
        this.previewUrls.push(previewUrl);
        this.selectFilesNames.push(file.name);
      };
  
      reader.readAsDataURL(file);
    }
  }

  deleteFile(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectFilesNames.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.isFileSelected = this.previewUrls.length > 0;

    const fileInput = <HTMLInputElement>document.getElementById('Attachments');
    if (fileInput) {
      fileInput.value = '';
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
