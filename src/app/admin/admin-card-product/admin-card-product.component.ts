import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@app/products/product.model';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';

@Component({
    selector: 'app-admin-card-product',
    imports: [FormatCurrencyPipe, RouterLink],
    templateUrl: './admin-card-product.component.html',
    styleUrl: './admin-card-product.component.css',
})
export class AdminCardProductComponent {
    product = input<Product>();
}
