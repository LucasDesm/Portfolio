package com.portfolio.api.repository;

import com.portfolio.api.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StageRepository extends JpaRepository<Stage, Long> {
    Optional<Stage> findBySlug(String slug);
    List<Stage> findAllByOrderByIdAsc();
}
