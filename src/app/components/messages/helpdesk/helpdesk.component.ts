import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-helpdesk',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss']
})
export class HelpdeskComponent {
  public user: iUserTable = {} as iUserTable;
  public messages: iMessage[] = [];
  public messageForm!: FormGroup;
  private readonly apiUrl = 'https://localhost:7233/api/Message';
  successMsg: string = "";
  previewUrl: string | ArrayBuffer | null = null;
  isImageSelected: boolean = false;
  ticketId: number = 0;


  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      Attachments: new FormControl('', null),
      Content: new FormControl('', Validators.required)
    });
    this.route.params.subscribe(params => {
      this.ticketId = params['ticketId'];
      this.apiService.getMessagesByTicket(this.ticketId).subscribe({
        next: (response: any) => {
          console.log('response', response);
          this.messages = response.$values.map((message: any) => {
            return {
              Id: message.id,
              Content: message.content,
              AttachmentPaths: message.attachmentPaths.$values.map((attachmentPath: any) => attachmentPath.path),
              ticketID: message.ticketID
            }
          })
        },
        error: (error: any) => {
          console.error('Error al obtener los mensajes del ticket', error);
        }
      })
    });
  }

  onSubmit() {
    if(this.messageForm.valid) {
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

  createMessage(Content: string, TicketID: number): Observable<any> {
    const formData = new FormData();
    formData.append('MessageDTO.Content', Content);
    formData.append('MessageDTO.TicketID', TicketID.toString());
    
    const attachmentsControl = this.messageForm.get('Attachments');
  
    if (attachmentsControl) {
      const attachments = attachmentsControl.value;
      
      if (typeof attachments === 'string') {
        const fileInput = <HTMLInputElement>document.getElementById('Attachments');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          formData.append('MessageDTO.Attachments', fileInput.files[0], fileInput.files[0].name);
        }
      } else if (Array.isArray(attachments) && attachments.length > 0) {
        for (const attachment of attachments) {
          formData.append('MessageDTO.Attachments', attachment, attachment.name);
        }
      }
    }
  
    return this.http.post<any>(this.apiUrl, formData);
  }

  downloadAttachment(attachmentPath: string) {
    const pathPrefix = 'C:/ProyectoIoT/Back/ApiTest/AttachmentStorage/';
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
