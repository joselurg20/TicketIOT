import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent {
  ngOnInit() {
    Chart.register(...registerables);

    const ctx = document.getElementById('technicianChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST', 'NOT_SURE'],
        datasets: [{
          label: 'Cantidad de incidencias',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 100, 147, 0.2)',
            'rgba(116, 92, 216, 0.2)',
            'rgba(253, 183, 63, 0.2)',
            'rgba(59, 235, 151, 0.2)',
            'rgba(59, 214, 235, 0.2)',
            'rgba(255, 255, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 100, 147, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
