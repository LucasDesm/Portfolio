package com.portfolio.api.service;

import com.portfolio.api.entity.ContactMessage;
import com.portfolio.api.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactMessage save(ContactMessage message) {
        return contactRepository.save(message);
    }
}
