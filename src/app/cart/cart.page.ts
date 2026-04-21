import { Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
    selector: 'app-cart-page',
    imports: [HeaderComponent, FooterComponent],
    templateUrl: './cart.page.html',
    styleUrl: './cart.page.css',
})
export class CartPage {}
