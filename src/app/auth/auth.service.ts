import { inject, Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';

import {
    Auth,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword as firebaseUpdatePassword,
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

    updatePassword(currentPassword: string, newPassword: string): Observable<void> {
        const user = this.auth.currentUser;
        if (!user || !user.email) {
            return throwError(() => new Error('Usuario no autenticado.'));
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        const promise = reauthenticateWithCredential(user, credential).then(() =>
            firebaseUpdatePassword(user, newPassword),
        );
        return from(promise);
    }
}
