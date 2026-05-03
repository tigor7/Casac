import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { AuthService } from '@app/auth/auth.service';

@Component({
    selector: 'app-profile-security-page',
    imports: [CommonModule, FormField],
    templateUrl: './profile-security.page.html',
    styleUrl: './profile-section.css',
})
export class ProfileSecurityPage {
    private authService = inject(AuthService);

    securityModel = signal({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    securityForm = form(this.securityModel, (schema) => {
        required(schema.currentPassword, { message: 'La contrasena actual es obligatoria.' });
        minLength(schema.currentPassword, 6, { message: 'Minimo 6 caracteres.' });

        required(schema.newPassword, { message: 'La nueva contrasena es obligatoria.' });
        minLength(schema.newPassword, 6, { message: 'Minimo 6 caracteres.' });

        required(schema.confirmPassword, { message: 'Confirma la nueva contrasena.' });
        minLength(schema.confirmPassword, 6, { message: 'Minimo 6 caracteres.' });
    });

    get passwordsMismatch(): boolean {
        const { newPassword, confirmPassword } = this.securityModel();
        return !!newPassword && !!confirmPassword && newPassword !== confirmPassword;
    }

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.securityForm().invalid() || this.passwordsMismatch) {
            this.markAllTouched();
            return;
        }

        const { currentPassword, newPassword } = this.securityModel();
        this.authService.updatePassword(currentPassword, newPassword).subscribe({
            next: () => {
                console.log('Contrasena actualizada');
                this.securityForm.currentPassword().value.set('');
                this.securityForm.newPassword().value.set('');
                this.securityForm.confirmPassword().value.set('');
            },
        });
    }

    private markAllTouched() {
        this.securityForm.currentPassword().markAsTouched();
        this.securityForm.newPassword().markAsTouched();
        this.securityForm.confirmPassword().markAsTouched();
    }
}
