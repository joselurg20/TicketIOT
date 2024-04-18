import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-snackbar-password',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule, TranslateModule],
  templateUrl: './snackbar-password.component.html',
  styleUrls: ['./snackbar-password.component.scss']
})
export class SnackbarPasswordComponent {

  snackBarRef = inject(MatSnackBarRef<SnackbarPasswordComponent>);

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
