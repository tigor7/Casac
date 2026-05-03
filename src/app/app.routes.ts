import { Routes } from '@angular/router';
import { HomePage } from '@app/home/home.page';
import { ProductDetailPage } from './products/detail/product-detail.page';
import { ShopPage } from '@app/products/shop/shop.page';
import { CartPage } from '@app/cart/cart.page';
import { SignInPage } from '@app/auth/sign-in/sign-in.page';
import { CreateAccountPage } from '@app/auth/create-account/create-account.page';
import { CreateCompanyAccountPage } from '@app/auth/create-company-account/create-company-account.page';
import { ProfilePage } from '@app/users/profile/profile.page';
import { ProfileInfoPage } from '@app/users/profile/profile-info.page';
import { ProfileSecurityPage } from '@app/users/profile/profile-security.page';
import { ProfileOrdersPage } from '@app/users/profile/profile-orders.page';
import { ProfileAddressesPage } from '@app/users/profile/profile-addresses.page';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { AdminShopPage } from './admin/admin-shop-page/admin-shop.page';
import { AdminProductPage } from './admin/admin-product-page/admin-product-page';

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
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full',
            },
            {
                path: 'info',
                component: ProfileInfoPage,
            },
            {
                path: 'security',
                component: ProfileSecurityPage,
            },
            {
                path: 'orders',
                component: ProfileOrdersPage,
            },
            {
                path: 'addresses',
                component: ProfileAddressesPage,
            },
        ],
    },

    {
        path: 'admin/shop',
        component: AdminShopPage,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['business'] },
    },
    {
        path: 'admin/product/:id',
        component: AdminProductPage,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['business'] },
    },
    {
        path: 'admin/product',
        component: AdminProductPage,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['business'] },
    },
];
