package com.portfolio.api.controller;

import com.portfolio.api.entity.ParcoursStep;
import com.portfolio.api.service.ParcoursService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parcours")
@RequiredArgsConstructor
public class ParcoursController {

    private final ParcoursService parcoursService;

    @GetMapping
    public List<ParcoursStep> getAll() {
        return parcoursService.findAll();
    }
}
