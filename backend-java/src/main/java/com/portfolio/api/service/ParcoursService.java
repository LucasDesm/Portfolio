package com.portfolio.api.service;

import com.portfolio.api.entity.ParcoursStep;
import com.portfolio.api.repository.ParcoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParcoursService {

    private final ParcoursRepository parcoursRepository;

    public List<ParcoursStep> findAll() {
        return parcoursRepository.findAllByOrderByDisplayOrderAsc();
    }
}
