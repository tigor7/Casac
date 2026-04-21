import { Component } from '@angular/core';

@Component({
    selector: 'app-product-card',
    imports: [],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
    id = 1;
    img = 'alicates.png';
    shortDescription = 'Alicates';
    price = 12;
}
