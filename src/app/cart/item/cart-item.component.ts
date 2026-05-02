import { AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormatCurrencyPipe } from '@app/shared/pipes/format-currency.pipe';
import { CartItem } from '../cartItem.model';

@Component({
    selector: 'app-cart-item',
    imports: [AsyncPipe, FormatCurrencyPipe],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
    item = input.required<CartItem>();

    increaseQuantity = output<string>();
    decreaseQuantity = output<string>();
    removeItem = output<string>();
}
