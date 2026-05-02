import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, email, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-sign-in-page',
    imports: [CommonModule, RouterLink, FormField],
    templateUrl: './sign-in.page.html',
    styleUrl: './sign-in.page.css',
})
export class SignInPage {
    authService = inject(AuthService);
    router = inject(Router);

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

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.loginForm().invalid()) {
            this.markAllTouched();
            return;
        }

        const { email, password } = this.loginModel();
        this.authService
            .login(email, password)
            .subscribe({ next: () => this.router.navigate(['/profile']) });
    }

    private markAllTouched() {
        this.loginForm.email().markAsTouched();
        this.loginForm.password().markAsTouched();
    }

    googleLogin() {
        this.authService.googleLogin().then(() => this.router.navigate(['/profile']));
    }
}
