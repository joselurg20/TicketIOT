import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../button/button.component";

@Component({
    selector: 'app-recovered',
    standalone: true,
    templateUrl: './recovered.component.html',
    styleUrls: ['./recovered.component.scss'],
    imports: [CommonModule, ButtonComponent]
})
export class RecoveredComponent {
}
