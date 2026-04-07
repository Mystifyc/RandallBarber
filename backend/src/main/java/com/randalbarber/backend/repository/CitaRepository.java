package com.randalbarber.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    boolean existsByBarberoIdAndDiaAndHora(Long barberoId, LocalDate dia, LocalTime hora);
    List<Cita> findByBarberoIdAndDia(Long barberoId, LocalDate dia);
}
