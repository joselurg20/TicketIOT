import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-helpdesk',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss']
})
export class HelpdeskComponent {
  public messages: iMessage[] = [];
  public messageForm!: FormGroup;
  successMsg: string = "";
  previewUrl: string | ArrayBuffer | null = null;
  isImageSelected: boolean = false;
  ticketId: number = 0;
  public ticket = {} as iTicketDescriptor;
  public userName: string = '';
  durationInSeconds = 5;


  constructor(private route: ActivatedRoute,private _snackBar: MatSnackBar ,private apiService: ApiService, private router: Router, private http: HttpClient, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      Attachments: new FormControl('', null),
      Content: new FormControl('', Validators.required)
    });
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

  /**
   * Envía un nuevo mensaje a la incidencia seleccionada.
   */
  onSubmit() {
    if (this.messageForm.valid) {
      console.log('Datos del formulario:', this.messageForm.value);
      const Content = this.messageForm.value.Content;
      this.createMessage(Content, this.ticketId)
        .subscribe({
          next: (response) => {
            console.log('Message creado con éxito', response);
            this.successMsg = "Mensaje creado con éxito.";
            location.reload();
          },
          error: (error) => {
            console.error('Error en la solicitud', error);
            this.successMsg = "Error al crear el mensaje.";
          }
        });
    }
  }

  /**
   * Crea un nuevo mensaje para la incidencia cuyo id se pasa como parámetro.
   * @param Content el contenido del mensaje.
   * @param TicketID el id de la incidencia.
   * @returns 
   */
  createMessage(Content: string, TicketID: number): Observable<any> {
    const formData = new FormData();
    formData.append('Author', this.userName);
    formData.append('Content', Content);
    formData.append('TicketID', TicketID.toString());

    const attachmentsControl = this.messageForm.get('Attachments');

    if (attachmentsControl) {
      const attachments = attachmentsControl.value;

      if (typeof attachments === 'string') {
        const fileInput = <HTMLInputElement>document.getElementById('Attachments');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          formData.append('Attachments', fileInput.files[0], fileInput.files[0].name);
        }
      } else if (Array.isArray(attachments) && attachments.length > 0) {
        for (const attachment of attachments) {
          formData.append('Attachments', attachment, attachment.name);
        }
      }
    }

    return this.apiService.createMessage(formData);
  }

  /**
   * Actualiza la previsualización del archivo adjunto.
   * @param event el evento que lanza la función.
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.isImageSelected = file.type.startsWith('image/');
    }
  }
}
