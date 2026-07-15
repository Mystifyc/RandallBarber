package com.randalbarber.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    List<Cita> findByEstadoOrderByDiaAscHoraAsc(String estado);

    List<Cita> findByEstadoOrderByDiaDescHoraAsc(String estado);

    @Query("""
            SELECT c
            FROM Cita c
            WHERE c.estado = 'ACTIVA'
              AND (:clienteId IS NULL OR c.cliente.id = :clienteId)
              AND (:barberoId IS NULL OR c.barbero.id = :barberoId)
              AND (:dia IS NULL OR c.dia = :dia)
            ORDER BY c.dia DESC, c.hora ASC
            """)
    List<Cita> filtrarCitas(
            @Param("clienteId") Long clienteId,
            @Param("barberoId") Long barberoId,
            @Param("dia") LocalDate dia
    );

    @Query("""
            SELECT c
            FROM Cita c
            WHERE c.cliente.id = :clienteId
            ORDER BY c.dia DESC, c.hora DESC
            """)
    List<Cita> buscarHistorialPorCliente(
            @Param("clienteId") Long clienteId
    );    

    @Query("""
        SELECT c
        FROM Cita c
        WHERE c.barbero.id = :barberoId
          AND c.estado = 'ACTIVA'
          AND (
                c.dia < :hoy
                OR (c.dia = :hoy AND c.hora <= :horaActual)
              )
        ORDER BY c.dia DESC, c.hora DESC
        """)
        List<Cita> buscarHistorialPorBarbero(
                @Param("barberoId") Long barberoId,
                @Param("hoy") LocalDate hoy,
                @Param("horaActual") LocalTime horaActual
        );

        List<Cita> findByClienteIdAndEstadoOrderByDiaAscHoraAsc(
                Long clienteId,
                String estado
        );
}