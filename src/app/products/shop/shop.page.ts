import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { ProductCardComponent } from '@app/products/card/product-card.component';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-shop-page',
    imports: [HeaderComponent, FooterComponent, ProductCardComponent, AsyncPipe],
    templateUrl: './shop.page.html',
    styleUrl: './shop.page.css',
})
export class ShopPage implements OnInit {
    products$ = new Observable<Product[]>();
    constructor(private service: ProductService) {}

    ngOnInit(): void {
        this.products$ = this.service.getProducts();
    }
}
