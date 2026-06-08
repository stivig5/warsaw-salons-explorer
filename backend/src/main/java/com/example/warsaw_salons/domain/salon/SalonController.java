package com.example.warsaw_salons.domain.salon;

import com.example.warsaw_salons.domain.salon.dto.requests.SalonCreateRequest;
import com.example.warsaw_salons.domain.salon.dto.requests.SalonUpdateRequest;
import com.example.warsaw_salons.domain.salon.dto.responses.SalonResponse;
import com.example.warsaw_salons.domain.salon.dto.responses.SalonShortResponse;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salons")
public class SalonController {
    private final SalonService salonService;

    public SalonController(SalonService salonService) {
        this.salonService = salonService;
    }

    @PostMapping
    public ResponseEntity<SalonResponse> create(@RequestBody SalonCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salonService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salonService.getById(id));
    }

    @GetMapping
    public ResponseEntity<Page<SalonShortResponse>> getMany(
            @ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(salonService.getMany(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonResponse> update(
            @PathVariable Long id,
            @RequestBody SalonUpdateRequest request) {
        return ResponseEntity.ok(salonService.update(id, request));
    }

    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salonService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
