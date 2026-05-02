import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CreateAccountRequest } from '../create-account-request.dto';
import { UserService } from '@app/users/user-service';

@Component({
    selector: 'app-create-account-page',
    imports: [CommonModule, RouterLink, FormField],
    templateUrl: './create-account.page.html',
    styleUrl: './create-account.page.css',
})
export class CreateAccountPage {
    private userService = inject(UserService);
    private authService = inject(AuthService);

    registrationModel = signal({
        username: '',
        phone: '',
        fullname: '',
        email: '',
        password: '',
    });

    registrationForm = form(this.registrationModel, (schema) => {
        required(schema.username, { message: 'El usuario es obligatorio.' });
        minLength(schema.username, 4, { message: 'Minimo 4 caracteres.' });

        required(schema.phone, { message: 'El telefono es obligatorio.' });
        pattern(schema.phone, /^[0-9]{9}$/, { message: 'Introduce un telefono de 9 digitos.' });

        required(schema.fullname, { message: 'El nombre completo es obligatorio.' });

        required(schema.email, { message: 'El email es obligatorio.' });
        email(schema.email, { message: 'Introduce un email valido.' });

        required(schema.password, { message: 'La contrasena es obligatoria.' });
        minLength(schema.password, 6, { message: 'Minimo 6 caracteres.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.registrationForm().invalid()) {
            this.markAllTouched();
            return;
        }
        const { fullname, username, email, password, phone } = this.registrationModel();
        const createAccountReq: CreateAccountRequest = {
            fullname: fullname,
            username: username,
            email: email,
            password: password,
            phone: Number(phone),
        };
        this.authService.register(createAccountReq).subscribe((res) => {
            this.userService.addUser(res.user.uid, createAccountReq);
        });
    }

    private markAllTouched() {
        this.registrationForm.username().markAsTouched();
        this.registrationForm.phone().markAsTouched();
        this.registrationForm.fullname().markAsTouched();
        this.registrationForm.email().markAsTouched();
        this.registrationForm.password().markAsTouched();
    }
}
