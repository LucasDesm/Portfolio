package com.portfolio.api.controller;

import com.portfolio.api.entity.ContactMessage;
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
    public ContactMessage send(@Valid @RequestBody ContactMessage message) {
        return contactService.save(message);
    }
}
