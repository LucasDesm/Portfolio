package com.portfolio.api.service;

import com.portfolio.api.dto.ContactRequest;
import com.portfolio.api.dto.ContactResponse;
import com.portfolio.api.entity.ContactMessage;
import com.portfolio.api.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactResponse save(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().strip());
        message.setEmail(request.email().strip());
        message.setMessage(request.message().strip());
        ContactMessage saved = contactRepository.save(message);
        return new ContactResponse(saved.getId(), saved.getSentAt());
    }
}
