import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LenguageComponent } from "../../lenguage/lenguage.component";

@Component({
    selector: 'app-close',
    standalone: true,
    templateUrl: './close.component.html',
    styleUrls: ['./close.component.scss'],
    imports: [CommonModule, TranslateModule, LenguageComponent]
})
export class CloseComponent {

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
