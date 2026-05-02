import { inject, Injectable } from '@angular/core';
import { Product } from './product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';

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
}
