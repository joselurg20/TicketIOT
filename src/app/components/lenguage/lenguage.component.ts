import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lenguage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lenguage.component.html',
  styleUrls: ['./lenguage.component.scss']
})
export class LenguageComponent {

  esButtonPressed: boolean = true;
  enButtonPressed: boolean = false;

  toggleButtons(language: string) {
    if (language === 'es') {
      this.esButtonPressed = true;
      this.enButtonPressed = false;
    } else if (language === 'en') {
      this.esButtonPressed = false;
      this.enButtonPressed = true;
    }
  }

}


