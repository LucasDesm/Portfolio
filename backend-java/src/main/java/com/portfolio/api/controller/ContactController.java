package com.portfolio.api.controller;

import com.portfolio.api.dto.ContactRequest;
import com.portfolio.api.dto.ContactResponse;
import com.portfolio.api.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse send(@Valid @RequestBody ContactRequest request) {
        return contactService.save(request);
    }
}
