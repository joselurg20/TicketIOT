import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { ApiService } from 'src/app/services/api.service';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';
import { Subscription } from 'rxjs';

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
  isShowingAll: boolean = false;
  private graphUpdateSubscription: Subscription = {} as Subscription;

  constructor(private apiService: ApiService, private graphUpdateService: GraphUpdateService) {}

  ngOnInit() {
    if(localStorage.getItem('userRole') == 'SupportManager') {
      this.apiService.getTicketsByUser(-1).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          // Mapear la respuesta de la API utilizando la interfaz iTicketTable
          const tickets: iTicketGraph[] = response.$values.map((value: any) => {
            return {
              priority: value.priority,
              state: value.state,
              userId: value.userId // Asegúrate de asignar el valor correcto
            };
          });
          this.tickets = tickets; // Establecer los datos en la dataSource
          console.log('Datos mapeados para tabla', tickets);
          this.createChart();
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
      this.graphUpdateSubscription = this.graphUpdateService.graphUpdated$.subscribe(() => {
        console.log('Ticket update received');
        
        this.refreshGraphData();
      });
    } else {
      this.apiService.getTicketsByUser(parseInt(localStorage.getItem('userId')!)).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          // Mapear la respuesta de la API utilizando la interfaz iTicketTable
          const tickets: iTicketGraph[] = response.$values.map((value: any) => {
            return {
              priority: value.priority,
              state: value.state,
              userId: value.userId // Asegúrate de asignar el valor correcto
            };
          });
          this.tickets = tickets; // Establecer los datos en la dataSource
          console.log('Datos mapeados para tabla', tickets);
          this.createChart();
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    }
  }

  /**
   * Actualiza los datos del gráfico según si el usuario es manager o no.
   */
  refreshGraphData(): void {
    if(localStorage.getItem('userRole') == 'SupportManager') {
      if(this.isShowingAll){
        this.apiService.getTicketsByUser(-1).subscribe({
          next: (response: any) => {
            console.log('Tickets recibidos', response);
            // Mapear la respuesta de la API utilizando la interfaz iTicketTable
            const tickets: iTicketGraph[] = response.$values.map((value: any) => {
              return {
                priority: value.priority,
                state: value.state,
                userId: value.userId // Asegúrate de asignar el valor correcto
              };
            });
            this.tickets = tickets; // Establecer los datos en la dataSource
            console.log('Datos mapeados para tabla', tickets);
            this.createChart();
          },
          error: (error: any) => {
            console.error('Error al obtener los tickets del usuario:', error);
          }
        });
      }else {
        this.apiService.getTickets().subscribe({
          next: (response: any) => {
            console.log('Tickets recibidos', response);
            // Mapear la respuesta de la API utilizando la interfaz iTicketTable
            const tickets: iTicketGraph[] = response.$values.map((value: any) => {
              return {
                priority: value.priority,
                state: value.state,
                userId: value.userId // Asegúrate de asignar el valor correcto
              };
            });
            this.tickets = tickets; // Establecer los datos en la dataSource
            console.log('Datos mapeados para tabla', tickets);
            this.createChart();
          },
          error: (error: any) => {
            console.error('Error al obtener los tickets del usuario:', error);
          }
        });
      }
      this.isShowingAll = !this.isShowingAll;
    }
  }

  /**
   * Crea el gráfico.
   */
  createChart(): void{

    if(this.myChart){
      this.myChart.destroy();
    }

    const priorities: string[] = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST', 'NOT_SURE'];

    const incidentCounts = priorities.map(prio => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter((ticket: { priority: string; }) => ticket.priority === prio).length;
    });

    Chart.register(...registerables);

    const ctx = document.getElementById('technicianChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: priorities,
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
            /*'#c82337',
            '#e06236',
            '#fdb83f',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'grey'*/
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
