import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from 'src/app/services/tickets/alert.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType, AlertsDto } from 'src/app/models/shared/AlertDto';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

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
