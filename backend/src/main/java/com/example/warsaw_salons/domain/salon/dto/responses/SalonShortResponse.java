package com.example.warsaw_salons.domain.salon.dto.responses;

public record SalonShortResponse(
        Long id,
        String name,
        String district,
        String priceRange,
        Double rating
) {}
