import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@app/products/product.model';
import { ProductService } from '@app/products/product.service';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';

@Component({
    selector: 'app-admin-card-product',
    imports: [FormatCurrencyPipe, RouterLink],
    templateUrl: './admin-card-product.component.html',
    styleUrl: './admin-card-product.component.css',
})
export class AdminCardProductComponent {
    private productService = inject(ProductService);
    product = input.required<Product>();

    deleteProduct(event: Event) {
        event.preventDefault();
        this.productService.deleteProduct(this.product().id ?? '');
    }
}
