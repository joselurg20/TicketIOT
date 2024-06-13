import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LocalStorageKeys } from 'src/app/utilities/literals';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit, OnDestroy {

  esButtonPressed: boolean = true;
  enButtonPressed: boolean = false;

  translateSubscription: Subscription = Subscription.EMPTY;

  constructor(private translate: TranslateService, private languageUpdateService: LanguageUpdateService) {
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
    this.translateSubscription = this.translate.onLangChange.subscribe((event) => {
      this.updateButtonState(event.lang);
      localStorage.setItem(LocalStorageKeys.selectedLanguage, event.lang);
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
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
    setTimeout(() => {
      this.languageUpdateService.triggerGraphUpdate();
    }, 100)
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