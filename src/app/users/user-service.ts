import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { CreateAccountRequest } from '@app/auth/create-account-request.dto';
import { Observable } from 'rxjs';
import { Address, User } from './user.model';
import { CreateCompanyAccountRequest } from '@app/auth/create-company-account-request-dto';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private firestore = inject(Firestore);

    addUser(uuid: string, user: CreateAccountRequest) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, {
            fullname: user.fullname,
            username: user.username,
            phone: user.phone,
            email: user.email,
            role: 'customer',
            city: '',
        });
    }

    addCompany(uuid: string, company: CreateCompanyAccountRequest) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, {
            cif: company.cif,
            companyName: company.companyName,
            phone: company.phone,
            email: company.email,
            role: 'business',
            city: '',
        });
    }

    updateUser(uuid: string, data: Partial<User>) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, data, { merge: true });
    }

    updateAddress(uuid: string, address: Address) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, { address }, { merge: true });
    }

    getOrderById(orderId: string): Observable<Record<string, unknown> | undefined> {
        const ref = doc(this.firestore, 'orders', orderId);
        return docData(ref) as Observable<Record<string, unknown> | undefined>;
    }

    getUserById(uuid: string): Observable<User> {
        const ref = doc(this.firestore, 'users', uuid);
        return docData(ref) as Observable<User>;
    }
}
