import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { TicketsService } from 'src/app/services/tickets.service';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { Observable, Subscription } from 'rxjs';
import { Priorities } from 'src/app/utilities/enum';
import { LoadingComponent } from "../../shared/loading.component";
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})

export class ChartPieComponent implements OnInit {

  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por prioridad';
  titleEn: string = 'Tickets by priority';
  title: string = this.titleEs;
  private langUpdateSubscription: Subscription = {} as Subscription;
  loading$: Observable<boolean>;

  constructor(private ticketsService: TicketsService, private langUpdateService: LanguageUpdateService, private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.loadingService.showLoading();
    if (localStorage.getItem('selectedLanguage') == 'en') {
      this.title = this.titleEn;
    } else if (localStorage.getItem('selectedLanguage') == 'es') {
      this.title = this.titleEs;
    }
    this.ticketsService.ticketGraphs$.subscribe(tickets => {
      this.tickets = tickets;
      this.createChart();
      this.loadingService.hideLoading();
    });
    this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
      this.switchLanguage();
    });

  }

  /**
  * Cambia el idioma del título
  */
  switchLanguage() {
    if (localStorage.getItem('selectedLanguage') == 'en') {
      this.title = this.titleEn;
    } else if (localStorage.getItem('selectedLanguage') == 'es') {
      this.title = this.titleEs;
    }
    this.createChart();
  }

  /**
  * Crea el gráfico.
  */
  createChart(): void {

    if (this.myChart) {
      this.myChart.destroy();
    }

    const labels: string[] = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST', 'NOT_SURE'];
    const priorities: Priorities[] = [5, 4, 3, 2, 1, 0];

    const incidentCounts = priorities.map(prio => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter((ticket: { priority: Priorities; }) => ticket.priority === prio).length;
    });

    Chart.register(...registerables);

    const ctx = document.getElementById('technicianChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de incidencias',
          data: incidentCounts,
          backgroundColor: [
            '#c82337',
            '#e06236',
            '#fdb83f',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'grey'
          ],
          borderColor: [
            'black',
            'black',
            'black',
            'black',
            'black',
            'black'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          title: {
            display: true,
            text: this.title,
            color: '#EFB810',
            font: {
              size: 28
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        }
      }
    });
  }
}
