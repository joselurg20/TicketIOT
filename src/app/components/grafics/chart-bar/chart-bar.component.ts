import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { ApiService } from 'src/app/services/api.service';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit {

  tickets: iTicketGraph[] = [];
  myChart: any;
  isShowingAll: boolean = false;
  private graphUpdateSubscription: Subscription = {} as Subscription;

  constructor(private apiService: ApiService, private graphUpdateService: GraphUpdateService) { }

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
  createChart(): void {

    if(this.myChart) {
      this.myChart.destroy();
    }
    var states: string[] = [];
    Chart.register(...registerables);
    if(localStorage.getItem('userRole') == 'SupportManager') {
      states = ['OPENED', 'PAUSED', 'PENDING'];
    }else{
      states = ['OPENED', 'PAUSED'];
    }

    const incidentCounts = states.map(state => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter((ticket: { state: string; }) => ticket.state === state).length;
    });

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: states,
        datasets: [{
          label: '',
          data: incidentCounts,
          backgroundColor: [
            'rgba(59, 235, 151, 1)',
            '#e06236',
            'grey'
          ],
          borderColor: [
            'black',
            'black',
            'black'
            /*'rgba(59, 235, 151, 1)',
            '#e06236',
            'grey'*/
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'white'
            }
          }
          
        }
      }
    });
  }

  /**
   * Da formato a la fecha.
   * @param fecha la fecha a formatear.
   * @returns la fecha con formato 'DD/MM/AAAA - HH:mm:ss'
   */
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
}
