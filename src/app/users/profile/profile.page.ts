import { Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
    selector: 'app-profile-page',
    imports: [HeaderComponent, FooterComponent],
    templateUrl: './profile.page.html',
    styleUrl: './profile.page.css',
})
export class ProfilePage {}
