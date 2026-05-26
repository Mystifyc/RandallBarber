package com.randalbarber.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    boolean existsByBarberoIdAndDiaAndHora(
            Long barberoId,
            LocalDate dia,
            LocalTime hora
    );

    boolean existsByBarberoIdAndDiaAndHoraAndEstado(
            Long barberoId,
            LocalDate dia,
            LocalTime hora,
            String estado
    );

    boolean existsByBarberoIdAndDiaAndHoraAndEstadoAndIdNot(
            Long barberoId,
            LocalDate dia,
            LocalTime hora,
            String estado,
            Long id
    );

    List<Cita> findByBarberoIdAndDia(
            Long barberoId,
            LocalDate dia
    );

    List<Cita> findByBarberoIdAndDiaAndEstado(
            Long barberoId,
            LocalDate dia,
            String estado
    );

    List<Cita> findByDiaAndEstado(
            LocalDate dia,
            String estado
    );
}