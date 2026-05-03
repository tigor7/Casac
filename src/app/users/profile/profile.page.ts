import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';

@Component({
    selector: 'app-profile-page',
    imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './profile.page.html',
    styleUrl: './profile.page.css',
})
export class ProfilePage {}
