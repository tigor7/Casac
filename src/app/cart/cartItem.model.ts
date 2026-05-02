import { Product } from '@app/products/product.model';

export interface CartItem {
    productId: string;
    quantity: number;
    product: Product;
}
