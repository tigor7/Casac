import { Component, input } from '@angular/core';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-product-card',
    imports: [RouterLink],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
    product = input<Product>();
    constructor() {}
}
