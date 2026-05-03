import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { CreateCompanyAccountRequest } from '../create-company-account-request-dto';
import { AuthService } from '../auth.service';
import { UserService } from '@app/users/user-service';

@Component({
    selector: 'app-create-company-account-page',
    imports: [CommonModule, FormField],
    templateUrl: './create-company-account.page.html',
    styleUrl: './create-company-account.page.css',
})
export class CreateCompanyAccountPage {
    private authService = inject(AuthService);
    private userService = inject(UserService);

    companyModel = signal({
        cif: '',
        phone: '',
        companyName: '',
        email: '',
        password: '',
    });

    companyForm = form(this.companyModel, (schema) => {
        required(schema.cif, { message: 'El CIF es obligatorio.' });
        pattern(schema.cif, /^[A-Za-z][0-9]{7}[0-9A-Za-z]$/, { message: 'CIF no valido.' });

        required(schema.phone, { message: 'El telefono es obligatorio.' });
        pattern(schema.phone, /^[0-9]{9}$/, { message: 'Introduce un telefono de 9 digitos.' });

        required(schema.companyName, { message: 'El nombre de la empresa es obligatorio.' });

        required(schema.email, { message: 'El email es obligatorio.' });
        email(schema.email, { message: 'Introduce un email valido.' });

        required(schema.password, { message: 'La contrasena es obligatoria.' });
        minLength(schema.password, 6, { message: 'Minimo 6 caracteres.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.companyForm().invalid()) {
            this.markAllTouched();
            return;
        }

        const { companyName, cif, email, password, phone } = this.companyModel();
        const createCompanyAccountReq: CreateCompanyAccountRequest = {
            cif: cif,
            email: email,
            companyName: companyName,
            password: password,
            phone: Number(phone),
            role: 'business',
        };
        this.authService.register(createCompanyAccountReq).subscribe((res) => {
            this.userService.addCompany(res.user.uid, createCompanyAccountReq);
        });
    }

    private markAllTouched() {
        this.companyForm.cif().markAsTouched();
        this.companyForm.phone().markAsTouched();
        this.companyForm.companyName().markAsTouched();
        this.companyForm.email().markAsTouched();
        this.companyForm.password().markAsTouched();
    }
}
