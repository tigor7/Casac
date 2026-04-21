import { Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { ProductCardComponent } from '@app/products/card/product-card.component';

@Component({
    selector: 'app-shop-page',
    imports: [HeaderComponent, FooterComponent, ProductCardComponent],
    templateUrl: './shop.page.html',
    styleUrl: './shop.page.css',
})
export class ShopPage {}
