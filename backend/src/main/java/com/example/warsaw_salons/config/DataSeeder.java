package com.example.warsaw_salons.config;

import com.example.warsaw_salons.domain.salon.Salon;
import com.example.warsaw_salons.domain.salon.SalonRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SalonRepo salonRepo;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final Random random = new Random();

    public DataSeeder(SalonRepo salonRepo) {
        this.salonRepo = salonRepo;
        this.objectMapper = new ObjectMapper();
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void run(String... args) throws Exception {
        if (salonRepo.count() == 0) {
            System.out.println("Database is empty. Fetching salon data from OpenStreetMap...");
            fetchAndSeedSalons();
        } else {
            System.out.println("Data already exists in the database. Skipping seeding.");
        }
    }

    private void fetchAndSeedSalons() {
        String url = "https://overpass-api.de/api/interpreter";

        // Overpass QL query fetching hairdressers and beauty salons in Warsaw
        String query = "[out:json][timeout:60];\n" +
                "area[\"name\"=\"Warszawa\"]->.searchArea;\n" +
                "(\n" +
                "  node[\"shop\"=\"hairdresser\"](area.searchArea);\n" +
                "  node[\"shop\"=\"beauty\"](area.searchArea);\n" +
                ");\n" +
                "out 150;";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("User-Agent", "WarsawSalonsApp/1.0");

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("data", query);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode elements = root.path("elements");

                List<Salon> salonsToSave = new ArrayList<>();
                String[] services = {"Haircut", "Coloring", "Manicure", "Pedicure", "Facial", "Massage", "Styling"};
                String[] priceRanges = {"$", "$$", "$$$"};
                String[] fallbackDistricts = {"Mokotów", "Śródmieście", "Wola", "Ursynów", "Bielany", "Praga-Południe"};

                for (JsonNode element : elements) {
                    JsonNode tags = element.path("tags");
                    String name = tags.path("name").asText(null);

                    if (name == null || name.isEmpty()) {
                        continue;
                    }

                    String street = tags.path("addr:street").asText("");
                    String houseNumber = tags.path("addr:housenumber").asText("");
                    String address = (street + " " + houseNumber).trim();
                    if (address.isEmpty()) {
                        address = "Warsaw (Exact address unavailable)";
                    }

                    String district = tags.path("addr:suburb").asText(null);
                    if (district == null || district.isEmpty()) {
                        district = fallbackDistricts[random.nextInt(fallbackDistricts.length)];
                    }

                    String phone = tags.has("phone") ? tags.path("phone").asText() :
                            (tags.has("contact:phone") ? tags.path("contact:phone").asText() : "+48 " + (100000000 + random.nextInt(900000000)));
                    String website = tags.has("website") ? tags.path("website").asText() :
                            (tags.has("contact:website") ? tags.path("contact:website").asText() : null);

                    String offeredServices = services[random.nextInt(services.length)] + ", " + services[random.nextInt(services.length)];
                    String priceRange = priceRanges[random.nextInt(priceRanges.length)];
                    double rating = Math.round((3.5 + (1.5 * random.nextDouble())) * 10.0) / 10.0;
                    int reviews = random.nextInt(496) + 5;

                    Salon salon = Salon.builder()
                            .name(name)
                            .address(address)
                            .district(district)
                            .phoneNumber(phone)
                            .website(website)
                            .servicesOffered(offeredServices)
                            .priceRange(priceRange)
                            .rating(rating)
                            .numberOfReviews(reviews)
                            .build();

                    salonsToSave.add(salon);

                    if (salonsToSave.size() >= 100) {
                        break;
                    }
                }

                salonRepo.saveAll(salonsToSave);
                System.out.println("Successfully completed! Saved " + salonsToSave.size() + " real salons (along with districts) in the PostgreSQL database.");
            }
        } catch (Exception e) {
            System.err.println("Error while fetching data: " + e.getMessage());
        }
    }
}