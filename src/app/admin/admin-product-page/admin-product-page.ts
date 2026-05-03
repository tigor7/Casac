import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@app/products/product.model';
import { ProductService } from '@app/products/product.service';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-product-page',
    imports: [HeaderComponent, FooterComponent, FormField],
    templateUrl: './admin-product-page.html',
    styleUrl: './admin-product-page.css',
})
export class AdminProductPage {
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);

    id: string | undefined;

    productModel = signal({
        name: '',
        description: '',
        price: '',
        discount: '',
    });

    productForm = form(this.productModel, (schema) => {
        required(schema.name, { message: 'El nombre del producto es obligatorio.' });
        minLength(schema.name, 4, { message: 'Minimo 4 caracteres.' });
        required(schema.description, { message: 'La descripción del producto es obligatorio.' });
        required(schema.price, { message: 'El precio del producto es obligatorio.' });
        pattern(schema.price, /^[0-9]+(.[0-9]{1,2})?$/, {
            message: 'Introduce un precio valido.',
        });
    });

    ngOnInit(): void {
        const productId = this.route.snapshot.paramMap.get('id');
        this.productService.getProductById(productId ?? '').subscribe((product) => {
            this.productForm.name().value.set(product.name);
            this.productForm.description().value.set(product.description);
            this.productForm.price().value.set(String(product.price / 100));

            this.id = product.id;
        });
    }
    onSubmit(event: Event) {
        event.preventDefault();

        if (this.productForm().invalid()) {
            this.markAllTouched();
            return;
        }
        const { name, price, description } = this.productModel();
        const product: Product = {
            name: name,
            price: Number(price) * 100,
            description: description,
            img: '',
            shortDescription: '',
        };
        if (this.id) {
            this.productService.updateProduct(this.id, product);
        } else {
            this.productService.addProduct(product);
        }
    }
    private markAllTouched() {
        this.productForm.name().markAsTouched();
        this.productForm.price().markAsTouched();
        this.productForm.description().markAsTouched();
        this.productForm.discount().markAsTouched();
    }
}
