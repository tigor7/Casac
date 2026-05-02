import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { CreateAccountRequest } from '@app/auth/create-account-request.dto';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private firestore = inject(Firestore);

    addUser(uuid: string, user: CreateAccountRequest) {
        const ref = doc(this.firestore, 'users', uuid);
        return setDoc(ref, { name: user.fullname, username: user.username });
    }
}
