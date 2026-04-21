import { Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
    selector: 'app-home-page',
    imports: [HeaderComponent, FooterComponent],
    templateUrl: './home.page.html',
    styleUrl: './home.page.css',
})
export class HomePage {}
