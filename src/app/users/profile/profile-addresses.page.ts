import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { AuthService } from '@app/auth/auth.service';
import { UserService } from '../user-service';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
    selector: 'app-profile-addresses-page',
    imports: [CommonModule, FormField],
    templateUrl: './profile-addresses.page.html',
    styleUrl: './profile-section.css',
})
export class ProfileAddressesPage {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private userId = '';

    addressModel = signal({
        street: '',
        city: '',
        postalCode: '',
        country: '',
    });

    addressForm = form(this.addressModel, (schema) => {
        required(schema.street, { message: 'La direccion es obligatoria.' });
        minLength(schema.street, 5, { message: 'Minimo 5 caracteres.' });

        required(schema.city, { message: 'La ciudad es obligatoria.' });
        minLength(schema.city, 2, { message: 'Minimo 2 caracteres.' });

        required(schema.postalCode, { message: 'El codigo postal es obligatorio.' });
        pattern(schema.postalCode, /^[0-9]{5}$/, { message: 'Codigo postal no valido.' });

        required(schema.country, { message: 'El pais es obligatorio.' });
        minLength(schema.country, 2, { message: 'Minimo 2 caracteres.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.addressForm().invalid()) {
            this.markAllTouched();
            return;
        }

        if (!this.userId) return;
        this.userService.updateAddress(this.userId, this.addressModel()).then(() => {
            console.log('Direccion guardada:', this.addressModel());
        });
    }

    private markAllTouched() {
        this.addressForm.street().markAsTouched();
        this.addressForm.city().markAsTouched();
        this.addressForm.postalCode().markAsTouched();
        this.addressForm.country().markAsTouched();
    }

    constructor() {
        this.authService.user$.subscribe((user: FirebaseUser | null) => {
            if (!user?.uid) return;
            this.userId = user.uid;
        });
    }
}
