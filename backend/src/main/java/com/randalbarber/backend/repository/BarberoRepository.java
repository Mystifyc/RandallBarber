package com.randalbarber.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Barbero;

public interface BarberoRepository extends JpaRepository<Barbero, Long> {
    List<Barbero> findByActivoTrue();
}