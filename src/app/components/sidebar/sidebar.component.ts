import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { NavbarData } from '../../models/incidence/nav-data';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
  navData: NavbarData[] = [{
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
    click: this.goToDashboard.bind(this),
    route: this.getDashboardRoute()
  },

  {
    icon: 'fas fa-right-from-bracket fa-rotate-180',
    label: 'Cerrar sesión',
    click: this.logout.bind(this),
    route: '/logout'
  }];



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
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