import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { UserService } from '../user-service';

@Component({
    selector: 'app-profile-orders-page',
    imports: [CommonModule, FormField],
    templateUrl: './profile-orders.page.html',
    styleUrl: './profile-section.css',
})
export class ProfileOrdersPage {
    private userService = inject(UserService);

    ordersModel = signal({
        orderId: '',
        email: '',
        status: 'pendiente',
    });

    orderResult = signal<Record<string, unknown> | null>(null);
    orderNotFound = signal(false);

    ordersForm = form(this.ordersModel, (schema) => {
        required(schema.orderId, { message: 'El numero de pedido es obligatorio.' });
        minLength(schema.orderId, 6, { message: 'Minimo 6 caracteres.' });

        required(schema.email, { message: 'El email es obligatorio.' });
        email(schema.email, { message: 'Introduce un email valido.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.ordersForm().invalid()) {
            this.markAllTouched();
            return;
        }

        const { orderId } = this.ordersModel();
        this.userService.getOrderById(orderId).subscribe((order) => {
            this.orderResult.set(order ?? null);
            this.orderNotFound.set(!order);
        });
    }

    private markAllTouched() {
        this.ordersForm.orderId().markAsTouched();
        this.ordersForm.email().markAsTouched();
    }
}
