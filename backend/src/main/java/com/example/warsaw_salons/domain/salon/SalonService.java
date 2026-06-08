package com.example.warsaw_salons.domain.salon;

import com.example.warsaw_salons.domain.salon.dto.requests.SalonCreateRequest;
import com.example.warsaw_salons.domain.salon.dto.requests.SalonUpdateRequest;
import com.example.warsaw_salons.domain.salon.dto.responses.SalonResponse;
import com.example.warsaw_salons.domain.salon.dto.responses.SalonShortResponse;
import com.example.warsaw_salons.exceptions.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SalonService {

    private final SalonRepo salonRepo;

    public SalonService(SalonRepo salonRepo) {
        this.salonRepo = salonRepo;
    }

    public SalonResponse create(SalonCreateRequest request) {
        Salon salon = Salon.builder()
                .name(request.name())
                .address(request.address())
                .district(request.district())
                .phoneNumber(request.phoneNumber())
                .website(request.website())
                .servicesOffered(request.servicesOffered())
                .priceRange(request.priceRange())
                .rating(request.rating())
                .numberOfReviews(request.numberOfReviews())
                .build();

        return SalonMapper.toResponse(salonRepo.save(salon));
    }

    public SalonResponse update(Long id, SalonUpdateRequest request) {
        Salon salon = salonRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salon with ID " + id + " was not found!"));

        salon.setName(request.name());
        salon.setAddress(request.address());
        salon.setDistrict(request.district());
        salon.setPhoneNumber(request.phoneNumber());
        salon.setWebsite(request.website());
        salon.setServicesOffered(request.servicesOffered());
        salon.setPriceRange(request.priceRange());
        salon.setRating(request.rating());
        salon.setNumberOfReviews(request.numberOfReviews());

        return SalonMapper.toResponse(salonRepo.save(salon));
    }

    public SalonResponse getById(Long id) {
        return SalonMapper.toResponse(
                salonRepo.findById(id).orElseThrow(
                        () -> new ResourceNotFoundException("Salon with ID " + id + " was not found!")
                ));
    }

    public Page<SalonShortResponse> getMany(Pageable pageable) {
        return salonRepo.findAll(pageable)
                .map(SalonMapper::toShortResponse);
    }

    public void delete(Long id) {
        if (!salonRepo.existsById(id)) {
            throw new ResourceNotFoundException("Salon with ID " + id + " was not found!");
        }
        salonRepo.deleteById(id);
    }
}
