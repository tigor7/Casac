import { Injectable, signal } from '@angular/core';

interface CartItem {
    productId: number;
    quantity: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {
    items = signal<CartItem[]>([]);

    add(productId: number, quantity: number) {
        this.items.update((items) => {
            return this.addCartItem(items, productId, quantity);
        });
    }
    private addCartItem(items: CartItem[], productId: number, quantity: number): CartItem[] {
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId == productId) {
                items[i].quantity += quantity;
                return items;
            }
        }
        items.push({ productId: productId, quantity: quantity });
        return items;
    }
}
