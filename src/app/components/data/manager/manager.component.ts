import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketUpdateService } from 'src/app/services/ticketUpdate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  users: iUserGraph[] = [];  
  public priorities: string[] = ['NOT_SURE', 'LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
  public states: string[] = ['PENDING', 'OPENED', 'PAUSED', 'FINISHED'];
  selectedUserId: number = -1;
  selectedPriority: string = '';
  selectedPriorityValue: number = -1;
  selectedState: string = '';
  selectedStateValue: number = -1;

  constructor(private apiService: ApiService, private ticketUpdateService: TicketUpdateService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
      
    }
  }

  ngOnInit(): void {
    this.apiService.getTechnicians().subscribe({
      next: (response: any) => {
        console.log('Users recibidos', response);
        const users: iUserGraph[] = response.map((value: any) => {
          return {
            id: value.id,
            userName: value.userName
          };
        });
        this.users = users;
        console.log('Datos mapeados para graficos', users);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  updateTicket() {
    if(this.selectedUserId != -1) {
      this.apiService.assignTechnician(parseInt(localStorage.getItem('selectedTicket')!), this.selectedUserId).subscribe({
        next: () => {
          console.log('Técnico asignado correctamente');
          setTimeout(() => {
            this.ticketUpdateService.triggerTicketUpdate();
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error al asignar técnico', error);
        }
      });
    }
    if(this.selectedPriorityValue != -1) {
      this.apiService.changeTicketPriority(parseInt(localStorage.getItem('selectedTicket')!), this.selectedPriorityValue).subscribe({
        next: () => {
          console.log('Prioridad cambiada correctamente');
          setTimeout(() => {
            this.ticketUpdateService.triggerTicketUpdate();
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error al cambiar la prioridad', error);
        }
      });
    }
    if(this.selectedStateValue != -1) {
      this.apiService.changeTicketState(parseInt(localStorage.getItem('selectedTicket')!), this.selectedStateValue).subscribe({
        next: () => {
          console.log('Estado cambiado correctamente');
          setTimeout(() => {
            this.ticketUpdateService.triggerTicketUpdate();
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      })
    }
    this.ticketUpdateService.triggerTicketUpdate();
  }
}
