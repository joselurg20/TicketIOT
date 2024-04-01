import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { iTicketDescriptor } from "src/app/models/tickets/iTicketDescription";
import { iUserTable } from "src/app/models/users/iUserTable";
import { ApiService } from "src/app/services/api.service";
import { MessageComponent } from "../../messages/menssage/message.component";
import { IncidenceDataComponent } from "../incidence-data/incidence-data.component";
import { HelpdeskComponent } from "../../messages/helpdesk/helpdesk.component";
import { ComunicationComponent } from "../../messages/comunication/comunication.component";
import { TechnicialComponent } from "../../data/technicial/technicial.component";
import { ManagerComponent } from "../../data/manager/manager.component";


@Component({
    selector: 'app-incidences-review',
    standalone: true,
    templateUrl: './incidences-review.component.html',
    styleUrls: ['./incidences-review.component.scss'],
    imports: [CommonModule, MessageComponent, IncidenceDataComponent, ManagerComponent, HelpdeskComponent, ComunicationComponent, TechnicialComponent]
})
export class IncidencesReviewComponent implements OnInit {

  public ticket: iTicketDescriptor = {} as iTicketDescriptor;
  public user: iUserTable = {} as iUserTable;
  public users: iUserTable[] = [];
  public priorities: string[] = ['NOT_SURE', 'LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
  public states: string[] = ['PENDING', 'OPENED', 'PAUSED', 'FINISHED'];
  selectedUserId: number = 0;
  selectedPriority: string = '';
  selectedPriorityValue: number = -1;
  selectedState: string = '';
  selectedStateValue: number = -1;
  public messageForm!: FormGroup;
  private readonly apiUrl = 'https://localhost:7233/api/Message';
  successMsg: string = '';
  previewUrl: string | ArrayBuffer | null = null;
  isImageSelected: boolean = false;
  public techSuccessMsg = '';
  public prioSuccessMsg = '';
  public stateSuccessMsg = '';
  public success: boolean = true;

  constructor(private apiService: ApiService, private router: Router, private http: HttpClient) { }

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
            userID: response.userID,
            userName: "",
            messages: []
          };
          console.log('Ticket Recibido', this.ticket);
          this.apiService.getUserById(this.ticket.userID).subscribe({
            next: (response: any) => {
              this.user = {
                id: response.id,
                userName: response.userName,
                email: response.email,
                phoneNumber: response.phoneNumber
              };
            },
            error: (error: any) => {
              console.error('Error al obtener el usuario', error);
            }
          });
        },
        error: (error: any) => {
          console.error('Error al obtener el ticket', error);
        }
      });

      this.apiService.getUsers().subscribe({
        next: (response: any) => {
          this.users = response.$values.map((value: any) => {
            return {
              id: value.id,
              userName: value.userName,
              email: value.email,
              phoneNumber: value.phoneNumber
            };
          });
        },
        error: (error: any) => {
          console.error('Error al obtener los usuarios', error);
        }
      })
    }

  }

  asignTicket() {
    if (this.selectedUserId != 0) {
      if (this.selectedUserId) {
        this.apiService.assignTechnician(this.ticket.id, this.selectedUserId).subscribe({
          next: () => {
            console.log('Técnico asignado correctamente');
            this.techSuccessMsg = "Técnico asignado correctamente";
            setTimeout(() => {
              this.techSuccessMsg = "";
            }, 5000);
          },
          error: (error: any) => {
            console.error('Error al asignar técnico', error);
          }
        });
      } else {
        console.warn('Por favor, seleccione un técnico');
      }
    }
  }

  changePriority() {
    this.selectedPriorityValue = this.getPriorityValue(this.selectedPriority);
    if (this.selectedPriorityValue != -1) {
      this.apiService.changeTicketPriority(this.ticket.id, this.selectedPriorityValue).subscribe({
        next: () => {
          console.log('Prioridad cambiada correctamente');
          this.prioSuccessMsg = "Prioridad cambiada correctamente";
          setTimeout(() => {
            this.prioSuccessMsg = "";
          }, 5000);
        },
        error: (error: any) => {
          console.error('Error al cambiar la prioridad', error);
        }
      })
    }
  }

  changeState() {
    this.selectedStateValue = this.getStateValue(this.selectedState);
    if (this.selectedStateValue != -1) {
      this.apiService.changeTicketState(this.ticket.id, this.selectedStateValue).subscribe({
        next: () => {
          console.log('Estado cambiado correctamente');
          this.stateSuccessMsg = "Estado cambiado correctamente";
          setTimeout(() => {
            this.stateSuccessMsg = "";
          }, 5000);
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      })
    }
  }

  onSubmit() {
    if (this.messageForm.valid) {
      console.log('Datos del formulario:', this.messageForm.value);
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
            location.reload();

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

  goBack() {
    localStorage.removeItem('selectedTicket');
    this.router.navigate(['/support-manager']);
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

  getPriorityValue(priority: string): number {
    switch (priority) {
      case 'HIGHEST': return 1;
      case 'HIGH': return 2;
      case 'MEDIUM': return 3;
      case 'LOW': return 4;
      case 'LOWEST': return 5;
      default: return 0;
    }
  }

  getStateValue(state: string): number {
    switch (state) {
      case 'OPENED': return 1;
      case 'PAUSED': return 2;
      case 'FINISHED': return 3;
      default: return 0;
    }
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
