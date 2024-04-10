import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(private loginService: LoginService, private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
      
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language);
    this.setLanguageImage(language);
  }

  private setLanguageImage(language: string): void {
    const button = document.querySelector('.dropdown-toggle img') as HTMLImageElement;
    if (language === 'spanish') {
      button.src = '../../../assets/images/flags/spain.png';
    } else if (language === 'english') {
      button.src = '../../../assets/images/flags/england.png';
    }
  }

  getLanguageImage(): string {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage === 'es') {
      return '../../../assets/images/flags/spain.png';
    } else {
      return '../../../assets/images/flags/england.png';
    }
  }


  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
      this.translate.use(selectedLanguage);
      this.setLanguageImage(selectedLanguage);
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  goToDashboard() {
    if (localStorage.getItem('userRole') == 'SupportManager') {
      this.router.navigate(['/support-manager']);
    } else {
      this.router.navigate(['/support-technician']);
    }

  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }


  getDashboardRoute(): string {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'SupportManager') {
      return '/support-manager';
    } else {
      return '/support-technician';
    }
  }

  changeLanguage(language: string): void {
    const button = document.querySelector('.dropdown-toggle img') as HTMLImageElement;
    if (language === 'spanish') {
      button.src = '../../../assets/images/flags/spain.png';
    } else if (language === 'english') {
      button.src = '../../../assets/images/flags/england.png';
    }
  }

}