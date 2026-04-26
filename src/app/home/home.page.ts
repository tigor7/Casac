import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { Observable } from 'rxjs';
import { Product } from '@app/products/product.model';
import { ProductService } from '@app/products/product.service';
import { AsyncPipe } from '@angular/common';
import { ProductCardComponent } from '@app/products/card/product-card.component';

@Component({
    selector: 'app-home-page',
    imports: [HeaderComponent, FooterComponent, ProductCardComponent, AsyncPipe],
    templateUrl: './home.page.html',
    styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
    products$ = new Observable<Product[]>();
    constructor(private service: ProductService) {}

    ngOnInit(): void {
        this.products$ = this.service.getProducts();
    }
}
