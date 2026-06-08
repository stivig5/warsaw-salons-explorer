package com.example.warsaw_salons.domain.salon.dto.requests;

public record SalonUpdateRequest(
        String name,
        String address,
        String district,
        String phoneNumber,
        String website,
        String servicesOffered,
        String priceRange,
        Double rating,
        Integer numberOfReviews
) {}
