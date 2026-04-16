package com.randalbarber.backend.model.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import com.randalbarber.backend.model.entity.Cita;

public interface CitaDao {

    List<Cita> listarCitas();

    Optional<Cita> buscarPorId(Long id);

    Cita guardarCita(Cita cita);

    Cita actualizarCita(Long id, Cita cita);

    void eliminarCita(Long id);

    List<LocalTime> obtenerHorasDisponibles(Long barberoId, LocalDate dia);

    List<Cita> obtenerCitasPorBarberoYDia(Long barberoId, LocalDate dia);
}