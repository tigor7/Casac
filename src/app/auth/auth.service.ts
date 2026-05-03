import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import {
    Auth,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    user,
    UserCredential,
} from '@angular/fire/auth';
import { CreateAccountRequest } from './create-account-request.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    auth = inject(Auth);
    user$ = user(this.auth);

    constructor() {
        this.auth.setPersistence(browserSessionPersistence);
    }

    login(email: string, password: string): Observable<UserCredential> {
        const promise = signInWithEmailAndPassword(this.auth, email, password);
        return from(promise);
    }

    register(user: { password: string; email: string }): Observable<UserCredential> {
        const promise = createUserWithEmailAndPassword(this.auth, user.email, user.password);
        return from(promise);
    }

    googleLogin() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    logout(): Observable<void> {
        const promise = signOut(this.auth).then(() => {
            sessionStorage.clear();
        });
        return from(promise);
    }
}
