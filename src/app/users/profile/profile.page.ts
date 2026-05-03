import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { UserService } from '../user-service';
import { AuthService } from '@app/auth/auth.service';

@Component({
    selector: 'app-profile-page',
    imports: [CommonModule, HeaderComponent, FooterComponent, FormField],
    templateUrl: './profile.page.html',
    styleUrl: './profile.page.css',
})
export class ProfilePage implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService);

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

        console.log('Perfil actualizado:', this.profileModel());
    }

    private markAllTouched() {
        this.profileForm.fullname().markAsTouched();
        this.profileForm.email().markAsTouched();
        this.profileForm.phone().markAsTouched();
        this.profileForm.city().markAsTouched();
    }

    ngOnInit() {
        this.authService.user$.subscribe((user) => {
            this.profileForm.email().value.set(user?.email ?? '');
            this.userService.getUserById(user?.uid ?? '').subscribe((user_) => {
                console.log(user_);
                this.profileForm.fullname().value.set(user_.fullname);
                this.profileForm.phone().value.set(user_.phone);
            });
        });
    }
}
