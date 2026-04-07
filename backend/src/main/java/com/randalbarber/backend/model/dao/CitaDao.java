package com.randalbarber.backend.model.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.randalbarber.backend.model.entity.Cita;

public interface CitaDao {
    Cita guardarCita(Cita cita);
    Cita actualizarCita(Long id, Cita cita);
    void eliminarCita(Long id);
    List<Cita> listarCitas();
    List<LocalTime> obtenerHorasDisponibles(Long barberoId, LocalDate dia);
    List<Cita> obtenerCitasPorBarberoYDia(Long barberoId, LocalDate dia);
}
