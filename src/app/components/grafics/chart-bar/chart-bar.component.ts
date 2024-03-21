import { CommonModule } from '@angular/common';
import { R3TargetBinder } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit {
  ngOnInit() {
    Chart.register(...registerables);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['PENDING', 'OPENED', 'PAUSED', 'FINISHED'],
        datasets: [{
          label: 'Cantidad de incidencias',
          data: [12, 19, 3, 5],
          backgroundColor: [
            'rgba(232, 19, 87, 0.2)',
            'rgba(116, 92, 216, 0.2)',
            'rgba(253, 183, 63, 0.2)',
            'rgba(59, 235, 151, 0.2)',
          ],
          borderColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
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
