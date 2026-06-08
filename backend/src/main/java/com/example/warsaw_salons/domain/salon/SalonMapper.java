package com.example.warsaw_salons.domain.salon;

import com.example.warsaw_salons.domain.salon.dto.responses.SalonResponse;
import com.example.warsaw_salons.domain.salon.dto.responses.SalonShortResponse;

public class SalonMapper {
    public static SalonResponse toResponse(Salon entity) {
        return new SalonResponse(
                entity.getId(),
                entity.getName(),
                entity.getAddress(),
                entity.getDistrict(),
                entity.getPhoneNumber(),
                entity.getWebsite(),
                entity.getServicesOffered(),
                entity.getPriceRange(),
                entity.getRating(),
                entity.getNumberOfReviews()
        );
    }

    public static SalonShortResponse toShortResponse(Salon entity) {
        return new SalonShortResponse(
                entity.getId(),
                entity.getName(),
                entity.getDistrict(),
                entity.getPriceRange(),
                entity.getRating()
        );
    }
}
