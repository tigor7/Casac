import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(private http: HttpClient) {}

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>('http://localhost:3000/products/' + id);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('http://localhost:3000/products/');
    }
}
