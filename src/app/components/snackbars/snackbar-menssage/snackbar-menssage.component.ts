import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-snackbar-menssage',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './snackbar-menssage.component.html',
  styleUrls: ['./snackbar-menssage.component.scss']
})
export class SnackbarMenssageComponent {
  snackBarRef = inject(MatSnackBarRef<SnackbarMenssageComponent>);

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
