import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../menssage/message.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-comunication',
    standalone: true,
    templateUrl: './comunication.component.html',
    styleUrls: ['./comunication.component.scss'],
    imports: [CommonModule, MessageComponent, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class ComunicationComponent implements OnInit {

    public messageForm!: FormGroup;
    public ticket: iTicketDescriptor = {} as iTicketDescriptor;
    public success: boolean = true;
    successMsg: string = '';
    public userName: string = '';
    selectedFiles: File[] = [];

    constructor(private apiService: ApiService, private translate: TranslateService) {
      this.translate.addLangs(['en', 'es']);
      const lang = this.translate.getBrowserLang();
      if (lang !== 'en' && lang !== 'es') {
        this.translate.setDefaultLang('en');
      } else {
        this.translate.use('es');
        
      }
    }

    ngOnInit(): void {
        this.messageForm = new FormGroup({
            Attachments: new FormControl('', null),
            Content: new FormControl('', Validators.required)
          });
        const selectedTicket = localStorage.getItem('selectedTicket');
        if(selectedTicket != null){
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
                console.log('Ticket Recibido', this.ticket);
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

    previewUrls: Array<string | ArrayBuffer | null> = new Array();
    isFileSelected: boolean = false;
    isImageSelected: any;

    onSubmit() {
        if(this.messageForm.valid) {
          console.log('Datos del formulario:', this.messageForm.value);
          console.log('Ticket:', this.ticket.id);
          const Content = this.messageForm.value.Content;
          this.createMessage(Content, this.ticket.id)
          .subscribe({
            next: (response) => {
              console.log('Message creado con éxito', response);
              this.success = true;
              this.successMsg = "Mensaje creado con éxito.";
              setTimeout(() => {
                this.successMsg = "";
              }, 5000);
    
            },
            error: (error) => {
              console.error('Error en la solicitud', error);
              this.success = false;
              this.successMsg = "Error al crear el mensaje.";
              setTimeout(() => {
                this.successMsg = "";
              }, 5000);
            }
          });
          
        }
      }

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

      onFileChange(event: any) {
        this.selectedFiles = event.target.files;
        const files = this.selectedFiles;
        this.isFileSelected = true;
        for(let file of files) {
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              this.previewUrls.push(reader.result);
            };
            reader.readAsDataURL(file);
            this.isImageSelected = file.type.startsWith('image/');
          }
        }
      }
}
