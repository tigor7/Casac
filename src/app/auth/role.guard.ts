import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '@app/users/user-service';
import { User as FirebaseUser } from '@angular/fire/auth';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const userService = inject(UserService);
    const router = inject(Router);
    const allowedRoles = (route.data?.['roles'] as string[]) ?? [];

    return authService.user$.pipe(
        switchMap((user: FirebaseUser | null) => {
            if (!user?.uid) {
                router.navigate(['/signin']);
                return of(false);
            }

            if (allowedRoles.length === 0) return of(true);

            return userService.getUserById(user.uid).pipe(
                map((profile) => {
                    const userRole = profile?.role ?? 'customer';
                    if (allowedRoles.includes(userRole)) return true;
                    router.navigate(['/']);
                    return false;
                }),
            );
        }),
    );
};
