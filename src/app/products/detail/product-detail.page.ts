import { Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
    imports: [HeaderComponent, FooterComponent],
    templateUrl: './product-detail.page.html',
    styleUrl: './product-detail.page.css',
})
export class ProductDetailPage {
    img = 'bridas.png';
    name = 'Bridas';
    price = 3.99;
    description =
        'Pack de bridas de alta resistencia para organizar cables, sujetar piezas y mantener ordenadas instalaciones domesticas o de taller.';
}
