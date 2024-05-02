import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageKeys } from 'src/app/utilities/literals';

@Component({
  selector: 'app-lenguage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lenguage.component.html',
  styleUrls: ['./lenguage.component.scss']
})
export class LenguageComponent implements OnInit {

  esButtonPressed: boolean = true;
  enButtonPressed: boolean = false;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = localStorage.getItem(LocalStorageKeys.selectedLanguage) || this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use(lang);
      this.updateButtonState(lang);
    }
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event) => {
      this.updateButtonState(event.lang);
      localStorage.setItem(LocalStorageKeys.selectedLanguage, event.lang);
    });
  }

  /**
   * Cambia el idioma según marque el botón.
   * @param language el nuevo idioma.
   */
  toggleButtons(language: string) {
    if (language === 'es') {
      this.translate.use('es');
    } else if (language === 'en') {
      this.translate.use('en');
    }
  }

  /**
   * Cambia de idioma.
   * @param language el nuevo idioma.
   */
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  /**
   * Actualiza el botón seleccionado.
   * @param lang el idioma del botón seleccionado.
   */
  private updateButtonState(lang: string) {
    this.esButtonPressed = lang === 'es';
    this.enButtonPressed = lang === 'en';
  }

}