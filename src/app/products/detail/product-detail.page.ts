import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';
import { CartService } from '@app/cart/cart-service';

@Component({
    imports: [HeaderComponent, FooterComponent, AsyncPipe, FormatCurrencyPipe],
    templateUrl: './product-detail.page.html',
    styleUrl: './product-detail.page.css',
})
export class ProductDetailPage implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private route = inject(ActivatedRoute);

    product$ = new Observable<Product>();
    product: Product | undefined;
    quantity = signal(1);

    ngOnInit(): void {
        const productId = this.route.snapshot.paramMap.get('id');
        this.product$ = this.productService.getProductById(productId ?? '');
        this.product$.subscribe((product) => (this.product = product));
    }
    increaseQuantity() {
        this.quantity.update((quantity) => quantity + 1);
    }
    decreaseQuantity() {
        this.quantity.update((quantity) => {
            if (quantity - 1 > 0) return quantity - 1;
            return 1;
        });
    }

    addItem(id: string) {
        if (this.product) {
            this.cartService.add(id, this.quantity(), this.product);
        }
    }
}
