import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-snackbar-incidence',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule, TranslateModule],
  templateUrl: './snackbar-incidence.component.html',
  styleUrls: ['./snackbar-incidence.component.scss']
})
export class SnackbarIncidenceComponent {
  snackBarRef = inject(MatSnackBarRef<SnackbarIncidenceComponent>);

  constructor() {

  }
}
