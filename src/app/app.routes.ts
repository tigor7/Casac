import { Routes } from '@angular/router';
import { HomePage } from '@app/home/home.page';
import { ShopPage } from '@app/products/shop/shop.page';
import { CartPage } from '@app/cart/cart.page';
import { SignInPage } from '@app/auth/sign-in/sign-in.page';
import { CreateAccountPage } from '@app/auth/create-account/create-account.page';
import { CreateCompanyAccountPage } from '@app/auth/create-company-account/create-company-account.page';
import { ProfilePage } from '@app/users/profile/profile.page';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
    },
    {
        path: 'shop',
        component: ShopPage,
    },
    {
        path: 'product/:id',
        component: ProductDetailPage,
    },
    {
        path: 'cart',
        component: CartPage,
    },
    {
        path: 'signin',
        component: SignInPage,
    },
    {
        path: 'create-account',
        component: CreateAccountPage,
    },
    {
        path: 'create-company-account',
        component: CreateCompanyAccountPage,
    },

    {
        path: 'profile',
        component: ProfilePage,
    },
];
