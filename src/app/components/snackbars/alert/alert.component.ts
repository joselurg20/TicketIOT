import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  snackBarRef = inject(MatSnackBarRef<AlertComponent>);

  constructor() {

  }

}
