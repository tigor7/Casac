import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    imports: [HeaderComponent, FooterComponent, AsyncPipe],
    templateUrl: './product-detail.page.html',
    styleUrl: './product-detail.page.css',
})
export class ProductDetailPage implements OnInit {
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    product$ = new Observable<Product>();
    constructor() {}
    ngOnInit(): void {
        const productId = Number(this.route.snapshot.paramMap.get('id'));
        this.product$ = this.productService.getProductById(productId);
    }
}
