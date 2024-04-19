import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-snackbar-recovered',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule, TranslateModule],
  templateUrl: './snackbar-recovered.component.html',
  styleUrls: ['./snackbar-recovered.component.scss']
})
export class SnackbarRecoveredComponent {


  snackBarRef = inject(MatSnackBarRef<SnackbarRecoveredComponent>);

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
        this.translate.setDefaultLang('en');
    } else {
        this.translate.use('es');

    }
}


}