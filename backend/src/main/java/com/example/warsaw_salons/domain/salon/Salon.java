package com.example.warsaw_salons.domain.salon;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "salons")
public class Salon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String district;

    private String phoneNumber;
    private String website;
    private String servicesOffered;
    private String priceRange;
    private Double rating;
    private Integer numberOfReviews;
}
