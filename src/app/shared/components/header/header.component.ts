import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { CartService } from '@app/cart/cart-service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private cartService = inject(CartService);

    numItems = computed(() => this.cartService.items().length);
    user$ = this.authService.user$;

    logout() {
        this.authService.logout();
    }
}
