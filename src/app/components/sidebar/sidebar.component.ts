import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Routes } from 'src/app/utilities/routes';  
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LoginService } from 'src/app/services/users/login.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  esButtonPressed: boolean = true;
  enButtonPressed: boolean = false;
  isSupportManager: boolean = false;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  loggedUserName: string = "";



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }


  constructor(private loginService: LoginService, private router: Router, private translate: TranslateService,
              private langUpdateService: LanguageUpdateService, private usersService: UsersService) {
    this.translate.addLangs(['en', 'es']);
    var lang = '';
    switch(localStorage.getItem(LocalStorageKeys.userLanguageKey)) {
      case '1':
        lang = 'en';
        break;
      case '2':
        lang = 'es';
        break;
      default:
        lang = 'es';
        break;
    }
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use(lang);
    }
  }

  /**
  * Cambia el lenguaje.
  * @param language el nuevo lenguaje Ej: 'en'.
  */
  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem(LocalStorageKeys.selectedLanguage, language);
    this.setLanguageImage(language);
    this.langUpdateService.triggerGraphUpdate();
  }

  /**
  * Cambia el icono del idioma.
  * @param language el nuevo lenguaje Ej: 'en'.
  */
  private setLanguageImage(language: string): void {
    const button = document.querySelector('.dropdown-toggle img') as HTMLImageElement;
    if (language === 'spanish') {
      button.src = '../../../assets/images/flags/spain.png';
    } else if (language === 'english') {
      button.src = '../../../assets/images/flags/england.png';
    }
  }

  /**
  * Obtiene el icono del idioma.
  * @returns la ruta al icono.
  */
  getLanguageImage(): string {
    const selectedLanguage = localStorage.getItem(LocalStorageKeys.selectedLanguage);
    if (selectedLanguage === 'es') {
      return '../../../assets/images/flags/spain.png';
    } else {
      return '../../../assets/images/flags/england.png';
    }
  }


  ngOnInit(): void {
    setTimeout(() => {
    
    this.screenWidth = window.innerWidth;
    const selectedLanguage = localStorage.getItem(LocalStorageKeys.selectedLanguage);
    if (selectedLanguage) {
      this.translate.use(selectedLanguage);
      this.setLanguageImage(selectedLanguage);
    }
    const userName = this.usersService.currentUser?.userName;
    if (userName) {
      this.loggedUserName = userName;
    }
    if (this.usersService.currentUser?.role === Roles.managerRole) {
      this.isSupportManager = true;
    }  
    }, 10)
  }

  /**
   * Cambia el estado de la barra lateral.
   * @param screenWidth el ancho de la barra lateral.
   * @param collapsed el estado de la barra lateral.
  */
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  /**
  * Cierra la barra lateral.
  */
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  /**
  * Navega a la ruta correspondiente.
  */
  goToDashboard() {
    if (this.usersService.currentUser?.role === Roles.managerRole) {
      this.router.navigate([Routes.supportManager]);
    } else {
      this.router.navigate([Routes.supportTechnician]); 
    }

  }

  /**
  * Cierra la sesión.
  */
  logout() {
    this.loginService.logout();
  }

  /**
  * Cambia el idioma.
  * @param language el nuevo idioma.
  */
  changeLanguage(language: string): void {
    const button = document.querySelector('.dropdown-toggle img') as HTMLImageElement;
    if (language === 'spanish') {
      button.src = '../../../assets/images/flags/spain.png';
    } else if (language === 'english') {
      button.src = '../../../assets/images/flags/england.png';
    }
  }

}