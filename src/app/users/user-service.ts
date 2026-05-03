import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { CreateAccountRequest } from '@app/auth/create-account-request.dto';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private firestore = inject(Firestore);

    addUser(uuid: string, user: CreateAccountRequest) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, { fullname: user.fullname, username: user.username, phone: user.phone });
    }

    getUserById(uuid: string): Observable<User> {
        const ref = doc(this.firestore, 'users', uuid);
        return docData(ref) as Observable<User>;
    }
}
