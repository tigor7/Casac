import { Component, inject } from '@angular/core';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { AdminCardProductComponent } from '../admin-card-product/admin-card-product.component';
import { Product } from '@app/products/product.model';
import { Observable } from 'rxjs';
import { ProductService } from '@app/products/product.service';
import { AsyncPipe } from '@angular/common';

@Component({
    imports: [AdminCardProductComponent, HeaderComponent, FooterComponent, AsyncPipe],
    templateUrl: './admin-shop.page.html',
    styleUrl: './admin-shop.page.css',
})
export class AdminShopPage {
    private productService = inject(ProductService);
    products$ = new Observable<Product[]>();

    ngOnInit(): void {
        this.products$ = this.productService.getProducts();
    }
}
