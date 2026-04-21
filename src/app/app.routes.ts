import { Routes } from '@angular/router';
import { HomePage } from '@app/home/home.page';
import { ShopPage } from '@app/products/shop/shop.page';
import { SignInPage } from '@app/auth/sign-in/sign-in.page';
import { CreateAccountPage } from '@app/auth/create-account/create-account.page';

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
        path: 'signin',
        component: SignInPage,
    },
    {
        path: 'create-account',
        component: CreateAccountPage,
    },
];
