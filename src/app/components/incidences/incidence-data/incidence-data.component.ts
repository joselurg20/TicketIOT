import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { iUser } from 'src/app/models/users/iUser';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketUpdateService } from 'src/app/services/tickets/ticketUpdate.service';
import { ButtonComponent } from "../../button/button.component";
import { LoadingComponent } from "../../shared/loading/loading.component";
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { iTicketUserDto } from 'src/app/models/tickets/iTicketUserDto';
import { Utils } from 'src/app/utilities/utils';

@Component({
  selector: 'app-incidence-data',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule, LoadingComponent],
  templateUrl: './incidence-data.component.html',
  styleUrls: ['./incidence-data.component.scss']

})
export class IncidenceDataComponent implements OnInit, OnDestroy {

  ticket: iTicketDescriptor = {
    id: 0,
    title: '',
    name: '',
    email: '',
    timestamp: '',
    priority: 0,
    status: 0,
    userId: '0',
    userName: ''
  };
  ticketPrio: string = '';
  ticketStatus: string = '';
  private ticketUpdateSubscription: Subscription = Subscription.EMPTY;
  loading$: Observable<boolean>;

  languageUpdateSubscription: Subscription = Subscription.EMPTY;
  ticketSubscription: Subscription = Subscription.EMPTY;

  constructor(private ticketsService: TicketsService, private ticketUpdateService: TicketUpdateService,
              private loadingService: LoadingService, private cdr: ChangeDetectorRef,
              private translate: TranslateService, private languageUpdateService: LanguageUpdateService,
              private usersService: UsersService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.ticketSubscription = this.ticketsService.getTicketByIdWithName(parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!)).subscribe({
      next: (response: iTicketUserDto) => {
        // Mapear la respuesta de la API utilizando la interfaz iTicketTable
        const ticket: iTicketDescriptor = {
          id: response.id,
          title: response.title,
          name: response.name,
          email: response.email,
          timestamp: Utils.formatDate(response.timestamp),
          priority: response.priority,
          status: response.status,
          userId: response.userId.toString(),
          userName: response.fullName
        };
        this.ticketPrio = this.getPriorityString(ticket.priority);
        this.ticketStatus = this.getStatusString(ticket.status);
        this.ticket = ticket;
      },
      error: (error: any) => {
        console.error('Error al obtener los tickets del usuario:', error);
      }
    });

    this.ticketUpdateSubscription = this.ticketUpdateService.ticketUpdated$.subscribe(() => {
      this.refreshTicketData();
    });
    this.languageUpdateSubscription =this.languageUpdateService.langUpdated$.subscribe(() => {
      this.ticketPrio = this.getPriorityString(this.ticket.priority);
      this.ticketStatus = this.getStatusString(this.ticket.status);
    })
  }

  ngOnDestroy(): void {
    this.ticketUpdateSubscription.unsubscribe();
    this.languageUpdateSubscription.unsubscribe();
    this.ticketSubscription.unsubscribe();
  }

  /**
   * Vuelve a la vista anterior.
   */
  goBack() {
    window.history.back();
  }

  /**
   * Actualiza los datos de la incidencia.
   */
  refreshTicketData() {
    this.loadingService.showLoading();
    const selectedTicketId = parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!);
    this.ticketsService.getTicketById(selectedTicketId).subscribe({
      next: (response: any) => {
        // Actualizar solo los campos que han cambiado
        if (this.ticket.userId !== response.userId) {
          this.ticket.userId = response.userId;
          // Obtener el nombre de usuario actualizado
          this.usersService.getUserById(response.userId).subscribe({
            next: (userResponse: iUser) => {
              this.ticket.userName = userResponse.userName;
              this.loadingService.hideLoading();
              this.cdr.detectChanges();
            },
            error: (error: any) => {
              console.error('Error al obtener el usuario', error);
            }
          });
        }
        if (this.ticket.priority !== response.priority) {
          this.loadingService.showLoading();
          this.ticket.priority = response.priority;
          this.ticketPrio = this.getPriorityString(this.ticket.priority);
          this.cdr.detectChanges();

        }
        if (this.ticket.status !== response.status) {
          this.loadingService.showLoading();
          this.ticket.status = response.status;
          this.ticketStatus = this.getStatusString(this.ticket.status);
          this.cdr.detectChanges();
        }
        this.loadingService.hideLoading();
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    });
  }

  /**
   * Obtiene el texto a representar en función de la prioridad y el idioma.
   * @param priority la prioridad.
   * @returns la cadena de texto a representar.
   */
  getPriorityString(priority: number): string {
    return Utils.getPriorityString(priority);
  }

  /**
   * Obtiene el texto a representar en función del estado y el idioma.
   * @param status el estado.
   * @returns la cadena de texto a representar.
   */
  getStatusString(status: number): string {
    return Utils.getStatusString(status);
  }
}
