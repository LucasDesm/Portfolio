package com.portfolio.api.repository;

import com.portfolio.api.entity.ParcoursStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParcoursRepository extends JpaRepository<ParcoursStep, String> {
    List<ParcoursStep> findAllByOrderByDisplayOrderAsc();
}
