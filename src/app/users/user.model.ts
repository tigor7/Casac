export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface User {
    fullname?: string;
    username?: string;
    phone?: string;
    email?: string;
    city?: string;
    role?: string;
    cif?: string;
    companyName?: string;
    address?: Address;
}
