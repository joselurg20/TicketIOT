import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from './services/navigation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'TicketsIOT';
  currentURL: string = '';

  constructor(private router: Router, private navService: NavigationService) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd == true) {
        let auxValue: NavigationEnd = val as NavigationEnd;

        if (this.currentURL != auxValue.url) {
          this.currentURL = auxValue.url;
          this.navService.setNavigationRoute(auxValue.url);
        }
      }
    })
  }
  ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
  }
}
