import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { MessageComponent } from "../../components/messages/menssage/message.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { HelpdeskComponent } from "../../components/messages/helpdesk/helpdesk.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { HistoryComponent } from "../../components/messages/history/history.component";
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import * as CryptoJS from 'crypto-js';
import { LenguageComponent } from "../../components/lenguage/lenguage.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/components/shared/loading.component';
import { LoadingService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-incidence-user',
    standalone: true,
    templateUrl: './incidence-user.component.html',
    styleUrls: ['./incidence-user.component.scss'],
    imports: [CommonModule, MatGridListModule, NgFor, IncidenceTableComponent, IncidenceDataComponent, MessageComponent, HelpdeskComponent, ComunicationComponent, HistoryComponent, LenguageComponent, TranslateModule, LoadingComponent]
})
export class IncidenceUserComponent {
  public messages: iMessage[] = [];
  successMsg: string = "";
  ticketId: number = 0;
  public ticket = {} as iTicketDescriptor;
  public userName: string = '';
  hashedId: string = '';
  loading$: Observable<boolean>;
  
  
    constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router , private translate: TranslateService, private loadingService: LoadingService) {
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
      this.route.params.subscribe(params => {
        this.ticketId = params['ticketId'];
        this.hashedId = params['hashedId'];
        const hashedId = CryptoJS.SHA256(this.ticketId.toString()).toString();
        if(this.hashedId !== hashedId) {
          this.router.navigate(['/404']);
        }
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
            status: response.status,
            userId: response.userId,
            userName: ""
          }
          this.userName = this.ticket.name;
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al obtener el usuario', error);
        }
      });
      
    }
}
