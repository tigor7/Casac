import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { CartItemComponent } from './item/cart-item.component';
import { CartService } from './cart-service';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';
import { CartItem } from './cartItem.model';

@Component({
    selector: 'app-cart-page',
    imports: [HeaderComponent, FooterComponent, CartItemComponent, FormatCurrencyPipe],
    templateUrl: './cart.page.html',
    styleUrl: './cart.page.css',
})
export class CartPage {
    private cartService = inject(CartService);

    items = this.cartService.items;

    subtotal = computed(() => this.calculateSubtotal(this.items()));
    taxes = computed(() => this.subtotal() * 0.07);
    total = computed(() => this.subtotal() + this.taxes());

    calculateSubtotal(items: CartItem[]) {
        let sum = 0;
        for (let item of items) {
            sum += item.product.price * item.quantity;
        }
        return sum;
    }

    decreaseQuantity(productId: string) {
        this.items.update(([...items]) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].productId == productId) {
                    if (items[i].quantity - 1 > 0) {
                        items[i].quantity -= 1;
                    } else {
                        items.splice(i, 1);
                    }
                }
            }
            return items;
        });
    }

    increaseQuantity(productId: string) {
        this.items.update(([...items]) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].productId == productId) {
                    items[i].quantity += 1;
                }
            }
            return items;
        });
    }

    removeItem(productId: string) {
        console.log('remove');
        this.items.update(([...items]) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].productId == productId) {
                    items.splice(i, 1);
                }
            }
            return items;
        });
    }
}
