import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { CartService } from '@app/cart/cart-service';
import { UserService } from '@app/users/user-service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private cartService = inject(CartService);

    numItems = computed(() => this.cartService.items().length);
    user$ = this.authService.user$;
    role: string | undefined;

    constructor() {
        this.user$.subscribe((user) => {
            if (user) {
                this.userService.getUserById(user?.uid).subscribe((user_) => {
                    this.role = user_.role;
                });
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}
