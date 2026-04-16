package com.randalbarber.backend.model.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.randalbarber.backend.model.entity.Barbero;
import com.randalbarber.backend.model.entity.Cita;
import com.randalbarber.backend.model.entity.Cliente;
import com.randalbarber.backend.model.entity.Servicio;
import com.randalbarber.backend.repository.BarberoRepository;
import com.randalbarber.backend.repository.CitaRepository;
import com.randalbarber.backend.repository.ClienteRepository;
import com.randalbarber.backend.repository.ServicioRepository;

@Repository
public class CitaDaoImp implements CitaDao {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;
    private final ServicioRepository servicioRepository;

    public CitaDaoImp(
            CitaRepository citaRepository,
            ClienteRepository clienteRepository,
            BarberoRepository barberoRepository,
            ServicioRepository servicioRepository) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.barberoRepository = barberoRepository;
        this.servicioRepository = servicioRepository;
    }

    @Override
    public List<Cita> listarCitas() {
        return citaRepository.findAll();
    }

    @Override
    public Optional<Cita> buscarPorId(Long id) {
        return citaRepository.findById(id);
    }

    @Override
    public Cita guardarCita(Cita cita) {
        if (cita.getCliente() == null || cita.getCliente().getId() == null ||
            cita.getBarbero() == null || cita.getBarbero().getId() == null ||
            cita.getServicio() == null || cita.getServicio().getId() == null ||
            cita.getDia() == null || cita.getHora() == null) {
            throw new RuntimeException("Datos incompletos para la cita");
        }

        Cliente cliente = clienteRepository.findById(cita.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Barbero barbero = barberoRepository.findById(cita.getBarbero().getId())
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        Servicio servicio = servicioRepository.findById(cita.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        boolean existe = citaRepository.existsByBarberoIdAndDiaAndHora(
                barbero.getId(),
                cita.getDia(),
                cita.getHora());

        if (existe) {
            throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
        }

        Cita nuevaCita = new Cita();
        nuevaCita.setDia(cita.getDia());
        nuevaCita.setHora(cita.getHora());
        nuevaCita.setCliente(cliente);
        nuevaCita.setBarbero(barbero);
        nuevaCita.setServicio(servicio);

        return citaRepository.save(nuevaCita);
    }

    @Override
    public Cita actualizarCita(Long id, Cita cita) {
        return citaRepository.findById(id).map(c -> {

            if (cita.getCliente() == null || cita.getCliente().getId() == null ||
                cita.getBarbero() == null || cita.getBarbero().getId() == null ||
                cita.getServicio() == null || cita.getServicio().getId() == null ||
                cita.getDia() == null || cita.getHora() == null) {
                throw new RuntimeException("Datos incompletos para actualizar la cita");
            }

            Cliente cliente = clienteRepository.findById(cita.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

            Barbero barbero = barberoRepository.findById(cita.getBarbero().getId())
                    .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

            Servicio servicio = servicioRepository.findById(cita.getServicio().getId())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

            boolean existe = citaRepository.existsByBarberoIdAndDiaAndHoraAndIdNot(
                    barbero.getId(),
                    cita.getDia(),
                    cita.getHora(),
                    id
            );

            if (existe) {
                throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
            }

            c.setDia(cita.getDia());
            c.setHora(cita.getHora());
            c.setCliente(cliente);
            c.setBarbero(barbero);
            c.setServicio(servicio);

            return citaRepository.save(c);

        }).orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

    @Override
    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new RuntimeException("Cita no encontrada con id: " + id);
        }
        citaRepository.deleteById(id);
    }

    @Override
    public List<LocalTime> obtenerHorasDisponibles(Long barberoId, LocalDate dia) {
        List<LocalTime> ocupadas = citaRepository.findByBarberoIdAndDia(barberoId, dia)
                .stream()
                .map(Cita::getHora)
                .toList();

        List<LocalTime> todas = List.of(
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                LocalTime.of(12, 0),
                LocalTime.of(13, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0),
                LocalTime.of(17, 0)
        );

        return todas.stream()
                .filter(hora -> !ocupadas.contains(hora))
                .toList();
    }

    @Override
    public List<Cita> obtenerCitasPorBarberoYDia(Long barberoId, LocalDate dia) {
        return citaRepository.findByBarberoIdAndDia(barberoId, dia);
    }
}