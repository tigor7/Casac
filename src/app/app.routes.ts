import { Routes } from '@angular/router';
import { ShopPage } from '@app/products/shop/shop.page';

export const routes: Routes = [
    {
        path: 'shop',
        component: ShopPage,
    },
    {
        path: 'product/:id',
        component: ProductDetailPage,
    },
];
