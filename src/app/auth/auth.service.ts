import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import {
    Auth,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    user,
    UserCredential,
} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    auth = inject(Auth);
    user$ = user(this.auth);

    constructor() {
        setPersistence(this.auth, browserSessionPersistence);
    }

    login(email: string, password: string): Observable<UserCredential> {
        const promise = signInWithEmailAndPassword(this.auth, email, password);
        return from(promise);
    }

    register(email: string, password: string): Observable<UserCredential> {
        const promise = createUserWithEmailAndPassword(this.auth, email, password);
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
