import { CommonModule, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { Observable, Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/components/shared/loading/loading.component';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Routes } from 'src/app/utilities/routes';
import { Utils } from 'src/app/utilities/utils';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { LanguageComponent } from "../../components/language/language.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { HelpdeskComponent } from "../../components/messages/helpdesk/helpdesk.component";
import { HistoryComponent } from "../../components/messages/history/history.component";
import { MessageComponent } from "../../components/messages/message/message.component";

@Component({
  selector: 'app-incidence-user',
  standalone: true,
  imports: [CommonModule, MatGridListModule, NgFor, IncidenceTableComponent, IncidenceDataComponent, MessageComponent, HelpdeskComponent, ComunicationComponent, HistoryComponent, LanguageComponent, TranslateModule, LoadingComponent],
  templateUrl: './incidence-user.component.html',
  styleUrls: ['./incidence-user.component.scss']
})
export class IncidenceUserComponent implements OnInit, OnDestroy {
  public messages: iMessage[] = [];
  successMsg: string = "";
  ticketId: number = 0;
  public ticket = {} as iTicketDescriptor;
  public userName: string = '';
  hashedId: string = '';
  loading$: Observable<boolean>;
  ticketStatus: string = '';

  routeParamsSubscription: Subscription = Subscription.EMPTY;
  ticketsSubscription: Subscription = Subscription.EMPTY;
  langUpdateSubscription: Subscription = Subscription.EMPTY;


  constructor(private route: ActivatedRoute, private ticketsService: TicketsService, private router: Router,
    private translate: TranslateService, private loadingService: LoadingService,
    private languageUpdateService: LanguageUpdateService) {
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
    this.loadingService.showLoading();
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.ticketId = params['ticketId'];
      this.hashedId = params['hashedId'];
      const hashedId = CryptoJS.SHA256(this.ticketId.toString()).toString();
      if (this.hashedId !== hashedId) {
        this.router.navigate([Routes.notFound]);
      }
    });
    this.ticketsSubscription = this.ticketsService.getTicketById(this.ticketId).subscribe({
      next: (response: iTicket) => {
        this.ticket = {
          id: response.id,
          title: response.title,
          name: response.name,
          email: response.email,
          timestamp: response.timestamp,
          priority: response.priority,
          status: response.status,
          userId: response.userId.toString(),
          userName: ""
        }
        this.ticketStatus = this.getStatusString(this.ticket.status);
        this.userName = this.ticket.name;
        this.loadingService.hideLoading();
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario', error);
      }
    });
    this.langUpdateSubscription = this.languageUpdateService.langUpdated$.subscribe(() => {
      this.ticketStatus = this.getStatusString(this.ticket.status);
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.ticketsSubscription.unsubscribe();
    this.langUpdateSubscription.unsubscribe();
  }

  getStatusString(status: number): string {
    return Utils.getStatusString(status);
  }
}