import { inject, Injectable } from '@angular/core';
import { Product } from './product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    docData,
    Firestore,
    setDoc,
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private firestore = inject(Firestore);
    private http = inject(HttpClient);

    getProductById(id: string): Observable<Product> {
        const ref = doc(this.firestore, `products/${id}`);
        return docData(ref, { idField: 'id' }) as Observable<Product>;
    }

    getProducts(): Observable<Product[]> {
        const ref = collection(this.firestore, 'products');
        return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
    }

    addProduct(product: Product) {
        const ref = collection(this.firestore, 'products');
        return addDoc(ref, product);
    }

    updateProduct(uuid: string, product: Product) {
        const ref = doc(this.firestore, `products/${uuid}`);
        return setDoc(ref, product);
    }

    deleteProduct(uuid: string) {
        const ref = doc(this.firestore, `products/${uuid}`);
        return deleteDoc(ref);
    }
}
