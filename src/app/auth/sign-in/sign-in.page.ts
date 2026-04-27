import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, email, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-sign-in-page',
    imports: [CommonModule, RouterLink, FormField],
    templateUrl: './sign-in.page.html',
    styleUrl: './sign-in.page.css',
})
export class SignInPage {
    loginModel = signal({
        email: '',
        password: '',
    });

    loginForm = form(this.loginModel, (schema) => {
        required(schema.email, { message: 'El email es obligatorio.' });
        email(schema.email, { message: 'Introduce un email valido.' });
        required(schema.password, { message: 'La contrasena es obligatoria.' });
        minLength(schema.password, 6, { message: 'Minimo 6 caracteres.' });
    });

    constructor(private router: Router) {}

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.loginForm().invalid()) {
            this.markAllTouched();
            return;
        }

        const { email, password } = this.loginModel();
        console.log('Login:', email, password);
        this.router.navigate(['/profile']);
    }

    private markAllTouched() {
        this.loginForm.email().markAsTouched();
        this.loginForm.password().markAsTouched();
    }
}
