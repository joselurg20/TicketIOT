import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { TicketsService } from 'src/app/services/tickets.service';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { Subscription } from 'rxjs';
import { Priorities } from 'src/app/utilities/enum';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent {

  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por prioridad';
  titleEn: string = 'Tickets by priority';
  title: string = this.titleEs;
  labelsEs: string[] = ['MUY ALTA', 'ALTA', 'MEDIA', 'BAJA', 'MUY BAJA', 'INDEFINIDA'];
  labelsEn: string[] = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST', 'NOT SURE'];
  labels: string[] = this.labelsEs;
  private langUpdateSubscription: Subscription = {} as Subscription;

  constructor(private ticketsService: TicketsService, private langUpdateService: LanguageUpdateService) {}

  ngOnInit() {
    if(localStorage.getItem('selectedLanguage') == 'en'){
      this.title = this.titleEn;
      this.labels = this.labelsEn;
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
      this.labels = this.labelsEs;
    }
    this.ticketsService.ticketGraphs$.subscribe(tickets => {
      this.tickets = tickets;
      this.createChart();
    });
    this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
      this.switchLanguage();
    })
  }

  /**
   * Cambia el idioma del título
   */
  switchLanguage() {
    if(localStorage.getItem('selectedLanguage') == 'en'){
      this.title = this.titleEn;
      this.labels = this.labelsEn;
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
      this.labels = this.labelsEs;
    }
    this.createChart();
  }

  /**
   * Crea el gráfico.
   */
  createChart(): void{

    if(this.myChart){
      this.myChart.destroy();
    }

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
        labels: this.labels,
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
