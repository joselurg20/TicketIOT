import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../menssage/message.component";

@Component({
    selector: 'app-comunication',
    standalone: true,
    templateUrl: './comunication.component.html',
    styleUrls: ['./comunication.component.scss'],
    imports: [CommonModule, MessageComponent]
})
export class ComunicationComponent {
    onFileChange($event: Event) {
        throw new Error('Method not implemented.');
    }
    previewUrl: any;
    isImageSelected: any;
    successMsg: any;

}
