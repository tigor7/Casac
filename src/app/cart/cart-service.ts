import { Injectable, signal } from '@angular/core';
import { CartItem } from './cartItem.model';
import { Product } from '@app/products/product.model';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    items = signal<CartItem[]>([]);

    add(productId: string, quantity: number, product: Product) {
        this.items.update(([...items]) => {
            return this.addCartItem(items, productId, quantity, product);
        });
    }
    private addCartItem(
        items: CartItem[],
        productId: string,
        quantity: number,
        product: Product,
    ): CartItem[] {
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId == productId) {
                items[i].quantity += quantity;
                return items;
            }
        }
        items.push({ productId: productId, quantity: quantity, product: product });
        return items;
    }
}
