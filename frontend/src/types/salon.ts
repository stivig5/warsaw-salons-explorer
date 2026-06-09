export interface Salon {
    id: number;
    name: string;
    district: string;
    priceRange: string;
    rating: number;
    address?: string;
    phoneNumber?: string;
    website?: string;
    servicesOffered?: string;
    numberOfReviews?: number;
}

export interface SalonMutateRequest {
    name: string;
    address: string;
    district: string;
    phoneNumber: string;
    website: string;
    servicesOffered: string;
    priceRange: string;
    rating: number;
    numberOfReviews: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}