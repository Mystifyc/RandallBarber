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
    private final NotificacionDao notificacionDao;

    public CitaDaoImp(
            CitaRepository citaRepository,
            ClienteRepository clienteRepository,
            BarberoRepository barberoRepository,
            ServicioRepository servicioRepository,
            NotificacionDao notificacionDao) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.barberoRepository = barberoRepository;
        this.servicioRepository = servicioRepository;
        this.notificacionDao = notificacionDao;
    }

    @Override
    public List<Cita> listarCitas() {
        return citaRepository.findByEstadoOrderByDiaAscHoraAsc("ACTIVA");
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

        if (cita.getDia().isBefore(LocalDate.now())) {
                throw new RuntimeException("No se puede agendar una cita en una fecha pasada");
        }

        if (cita.getDia().isEqual(LocalDate.now()) && !cita.getHora().isAfter(LocalTime.now())) {
                throw new RuntimeException("No se puede agendar una cita en una hora que ya pasó");
        }

        Cliente cliente = clienteRepository.findById(cita.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Barbero barbero = barberoRepository.findById(cita.getBarbero().getId())
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        Servicio servicio = servicioRepository.findById(cita.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        boolean existe = citaRepository.existsByBarberoIdAndDiaAndHoraAndEstado(
                barbero.getId(),
                cita.getDia(),
                cita.getHora(),
                "ACTIVA");

        if (existe) {
            throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
        }

        Cita nuevaCita = new Cita();
        nuevaCita.setDia(cita.getDia());
        nuevaCita.setHora(cita.getHora());
        nuevaCita.setCliente(cliente);
        nuevaCita.setBarbero(barbero);
        nuevaCita.setServicio(servicio);
        nuevaCita.setEstado("ACTIVA");

        Cita citaGuardada = citaRepository.save(nuevaCita);
        
        crearNotificacionAdmin(
                "Nueva cita registrada",
                "Se creó una cita para el cliente " + cliente.getNombre()
                        + " con el barbero " + barbero.getNombre()
                        + " el día " + citaGuardada.getDia()
                        + " a las " + citaGuardada.getHora()
                        + ". Servicio: " + servicio.getNombre() + ".",
                "CITA_CREADA"
        );

        notificacionDao.crearNotificacionCliente(
        "Cita confirmada",
        "Tu cita fue confirmada para el "
                + citaGuardada.getDia()
                + " a las "
                + citaGuardada.getHora()
                + ". Servicio: "
                + servicio.getNombre()
                + ". Barbero: "
                + barbero.getNombre()
                + ".",
        "CITA_CONFIRMADA",
        citaGuardada
        );

        notificacionDao.crearNotificacionBarbero(
        "Nueva cita asignada",
        "Tienes una nueva cita con el cliente "
                + cliente.getNombre()
                + " el día "
                + citaGuardada.getDia()
                + " a las "
                + citaGuardada.getHora()
                + ". Servicio: "
                + servicio.getNombre()
                + ".",
        "CITA_CREADA",
        citaGuardada
        );  

        return citaGuardada;
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

            boolean existe = citaRepository.existsByBarberoIdAndDiaAndHoraAndEstadoAndIdNot(
                        barbero.getId(),
                        cita.getDia(),
                        cita.getHora(),
                        "ACTIVA",
                        id
                );

            if (existe) {
                throw new RuntimeException("El barbero ya tiene una cita en esa fecha y hora");
            }

                boolean cambioDia = !c.getDia().equals(cita.getDia());
                boolean cambioHora = !c.getHora().equals(cita.getHora());
                boolean cambioCliente = !c.getCliente().getId().equals(cliente.getId());
                boolean cambioBarbero = !c.getBarbero().getId().equals(barbero.getId());
                boolean cambioServicio = !c.getServicio().getId().equals(servicio.getId());

            c.setDia(cita.getDia());
            c.setHora(cita.getHora());
            c.setCliente(cliente);
            c.setBarbero(barbero);
            c.setServicio(servicio);

            Cita citaActualizada = citaRepository.save(c);

            if (cambioDia || cambioHora || cambioCliente || cambioBarbero || cambioServicio) {
                notificacionDao.generarNotificacionCitaModificada(citaActualizada);

                notificacionDao.crearNotificacionBarbero(
                        "Cita modificada",
                        "La cita con el cliente "
                                + cliente.getNombre()
                                + " fue modificada. Nueva información: "
                                + citaActualizada.getDia()
                                + " a las "
                                + citaActualizada.getHora()
                                + ". Servicio: "
                                + servicio.getNombre()
                                + ".",
                        "CITA_MODIFICADA",
                        citaActualizada
                );
            }

            crearNotificacionAdmin(
                    "Cita actualizada",
                    "Se actualizó la cita del cliente " + cliente.getNombre()
                            + " con el barbero " + barbero.getNombre()
                            + " para el día " + citaActualizada.getDia()
                            + " a las " + citaActualizada.getHora()
                            + ". Servicio: " + servicio.getNombre() + ".",
                    "CITA_ACTUALIZADA"
            );

            return citaActualizada;

        }).orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

    @Override
    public void eliminarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));

        String nombreCliente = cita.getCliente() != null ? cita.getCliente().getNombre() : "Cliente no identificado";
        String nombreBarbero = cita.getBarbero() != null ? cita.getBarbero().getNombre() : "Barbero no identificado";
        String nombreServicio = cita.getServicio() != null ? cita.getServicio().getNombre() : "Servicio no identificado";

        cita.setEstado("CANCELADA");
        Cita citaCancelada = citaRepository.save(cita);

        crearNotificacionAdmin(
                "Cita eliminada",
                "Se eliminó la cita del cliente " + nombreCliente
                        + " con el barbero " + nombreBarbero
                        + " programada para el día " + cita.getDia()
                        + " a las " + cita.getHora()
                        + ". Servicio: " + nombreServicio + ".",
                "CITA_ELIMINADA"
        );

        notificacionDao.generarNotificacionCitaCancelada(citaCancelada);

        notificacionDao.crearNotificacionBarbero(
        "Cita cancelada",
        "La cita con el cliente "
                + nombreCliente
                + " programada para el día "
                + citaCancelada.getDia()
                + " a las "
                + citaCancelada.getHora()
                + " fue cancelada. Servicio: "
                + nombreServicio
                + ".",
        "CITA_CANCELADA",
        citaCancelada
        );
    }

        @Override
         public List<LocalTime> obtenerHorasDisponibles(Long barberoId, LocalDate dia) {

        if (dia.isBefore(LocalDate.now())) {
                return List.of();
        }

        List<LocalTime> ocupadas = citaRepository.findByBarberoIdAndDiaAndEstado(
                    barberoId,
                    dia,
                    "ACTIVA"
                ).stream().map(Cita::getHora).toList();

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

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        return todas.stream()
            .filter(hora -> !ocupadas.contains(hora))
            .filter(hora -> {
                if (dia.isEqual(hoy)) {
                    return hora.isAfter(ahora);
                }
                return true;
            })
            .toList();
}

    @Override
    public List<Cita> obtenerCitasPorBarberoYDia(Long barberoId, LocalDate dia) {
        return citaRepository.findByBarberoIdAndDia(barberoId, dia);
    }

    @Override
    public List<Cita> obtenerHistorialPorCliente(Long clienteId) {
        if (clienteId == null) {
            throw new RuntimeException("El id del cliente es obligatorio");
        }

        boolean existeCliente = clienteRepository.existsById(clienteId);

        if (!existeCliente) {
            throw new RuntimeException("Cliente no encontrado");
        }

        return citaRepository.buscarHistorialPorCliente(clienteId);
    }

    @Override
    public List<Cita> obtenerHistorialPorBarbero(Long barberoId) {
        if (barberoId == null) {
            throw new RuntimeException("El id del barbero es obligatorio");
        }

        boolean existeBarbero = barberoRepository.existsById(barberoId);

        if (!existeBarbero) {
            throw new RuntimeException("Barbero no encontrado");
        }

        return citaRepository.buscarHistorialPorBarbero(
                barberoId,
                LocalDate.now(),
                LocalTime.now()
        );
    }

    @Override
    public List<Cita> obtenerCitasActivasPorCliente(Long clienteId) {
        if (clienteId == null) {
            throw new RuntimeException("El id del cliente es obligatorio");
        }

        boolean existeCliente = clienteRepository.existsById(clienteId);

        if (!existeCliente) {
            throw new RuntimeException("Cliente no encontrado");
        }

        return citaRepository.findByClienteIdAndEstadoOrderByDiaAscHoraAsc(
                clienteId,
                "ACTIVA"
        );
    }

    private void crearNotificacionAdmin(String titulo, String mensaje, String tipo) {
        notificacionDao.crearNotificacion(
                titulo,
                mensaje,
                tipo,
                "ADMIN"
        );
    }

    @Override
    public List<Cita> filtrarCitas(Long clienteId, Long barberoId, LocalDate dia) {
        return citaRepository.filtrarCitas(clienteId, barberoId, dia);
    }

    @Override
    public List<Cita> obtenerCitasCanceladas() {
        return citaRepository.findByEstadoOrderByDiaDescHoraAsc("CANCELADA");
    }
}