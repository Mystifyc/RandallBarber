package com.randalbarber.backend.model.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.randalbarber.backend.model.entity.Cita;
import com.randalbarber.backend.repository.CitaRepository;

@Repository
public class CitaDaoImp implements CitaDao {
    private final CitaRepository citaRepository;

    public CitaDaoImp(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    @Override
    public Cita guardarCita(Cita cita) {

        if (cita.getBarbero() == null || cita.getDia() == null || cita.getHora() == null) {
        throw new RuntimeException("Datos incompletos para la cita");
    }
        boolean existe = citaRepository.existsByBarberoIdAndDiaAndHora(
            cita.getBarbero().getId(),
            cita.getDia(),
            cita.getHora()
        );

        if (existe) {
            throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
        }

        return citaRepository.save(cita);
    }

    
    @Override
    public Cita actualizarCita(Long id, Cita cita) {
        return citaRepository.findById(id).map(c -> {

            boolean existe = citaRepository.existsByBarberoIdAndDiaAndHora(
                cita.getBarbero().getId(),
                cita.getDia(),
                cita.getHora()
            );

            // 🔥 Evita conflicto con otra cita (no consigo misma)
            if (existe && !c.getId().equals(id)) {
                throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
            }

            c.setDia(cita.getDia());
            c.setHora(cita.getHora());
            c.setServicio(cita.getServicio());
            c.setCliente(cita.getCliente());
            c.setBarbero(cita.getBarbero());

            return citaRepository.save(c);
            }).orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

    @Override
    public List<Cita> obtenerCitasPorBarberoYDia(Long barberoId, LocalDate dia) {
        return citaRepository.findByBarberoIdAndDia(barberoId, dia);
    }

    public List<LocalTime> obtenerHorasDisponibles(Long barberoId, LocalDate dia) {

        List<Cita> citas = citaRepository.findByBarberoIdAndDia(barberoId, dia);

        List<LocalTime> ocupadas = citas.stream()
            .map(Cita::getHora)
            .toList();

        List<LocalTime> disponibles = new ArrayList<>();

        LocalTime inicio = LocalTime.of(8, 0);
        LocalTime fin = LocalTime.of(18, 0);

        while (inicio.isBefore(fin)) {

            if (!ocupadas.contains(inicio)) {
                disponibles.add(inicio);
            }

            inicio = inicio.plusMinutes(30); // 🔥 intervalos de 30 min
        }

        return disponibles;
    }

    @Override
    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new RuntimeException("Cita no encontrada con id: " + id);
        }
        citaRepository.deleteById(id);
    }

    @Override
    public List<Cita> listarCitas() {
        return citaRepository.findAll();
    }
}
