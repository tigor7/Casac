import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { AuthService } from '@app/auth/auth.service';
import { UserService } from '../user-service';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
    selector: 'app-profile-info-page',
    imports: [CommonModule, FormField],
    templateUrl: './profile-info.page.html',
    styleUrl: './profile-section.css',
})
export class ProfileInfoPage implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private userId = '';

    profileModel = signal({
        fullname: '',
        email: '',
        phone: '',
        city: '',
    });

    profileForm = form(this.profileModel, (schema) => {
        required(schema.fullname, { message: 'El nombre es obligatorio.' });
        minLength(schema.fullname, 3, { message: 'Minimo 3 caracteres.' });

        required(schema.email, { message: 'El email es obligatorio.' });
        email(schema.email, { message: 'Introduce un email valido.' });

        required(schema.phone, { message: 'El telefono es obligatorio.' });
        pattern(schema.phone, /^[+0-9 ]{9,15}$/, { message: 'Telefono no valido.' });

        required(schema.city, { message: 'La ciudad es obligatoria.' });
        minLength(schema.city, 2, { message: 'Minimo 2 caracteres.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.profileForm().invalid()) {
            this.markAllTouched();
            return;
        }

        if (!this.userId) return;

        const { fullname, email, phone, city } = this.profileModel();
        this.userService
            .updateUser(this.userId, { fullname, email, phone, city })
            .then(() => console.log('Perfil actualizado:', this.profileModel()));
    }

    private markAllTouched() {
        this.profileForm.fullname().markAsTouched();
        this.profileForm.email().markAsTouched();
        this.profileForm.phone().markAsTouched();
        this.profileForm.city().markAsTouched();
    }

    ngOnInit() {
        this.authService.user$.subscribe((user: FirebaseUser | null) => {
            if (!user?.uid) return;
            this.userId = user.uid;
            this.profileForm.email().value.set(user.email ?? '');
            this.userService.getUserById(user.uid).subscribe((user_) => {
                if (!user_) return;
                this.profileForm.fullname().value.set(user_.fullname ?? '');
                this.profileForm.phone().value.set(user_.phone ?? '');
                this.profileForm.city().value.set(user_.city ?? '');
            });
        });
    }
}
