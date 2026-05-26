package com.randalbarber.backend.model.dao;

import java.util.List;

import org.springframework.stereotype.Repository;
import com.randalbarber.backend.model.entity.Cita;
import com.randalbarber.backend.model.entity.Notificacion;
import com.randalbarber.backend.repository.NotificacionRepository;

@Repository
public class NotificacionDaoImp implements NotificacionDao {

    private final NotificacionRepository notificacionRepository;

    public NotificacionDaoImp(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public List<Notificacion> listarNotificacionesAdmin() {
        return notificacionRepository.findByRolDestinoOrderByFechaCreacionDesc("ADMIN");
    }

    @Override
    public List<Notificacion> listarNoLeidasAdmin() {
        return notificacionRepository.findByRolDestinoAndLeidaFalseOrderByFechaCreacionDesc("ADMIN");
    }

    @Override
    public Notificacion crearNotificacion(String titulo, String mensaje, String tipo, String rolDestino) {
        Notificacion notificacion = new Notificacion(titulo, mensaje, tipo, rolDestino);
        return notificacionRepository.save(notificacion);
    }

    @Override
    public Notificacion marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con id: " + id));

        notificacion.setLeida(true);

        return notificacionRepository.save(notificacion);
    }

    @Override
    public void eliminarNotificacion(Long id) {
        if (!notificacionRepository.existsById(id)) {
            throw new RuntimeException("Notificación no encontrada con id: " + id);
        }

        notificacionRepository.deleteById(id);
    }

    @Override
    public List<Notificacion> listarPorCliente(Long clienteId) {
        return notificacionRepository.findByClienteIdOrderByFechaCreacionDesc(clienteId);
    }

    @Override
    public Notificacion crearNotificacionCliente(String titulo, String mensaje, String tipo, Cita cita) {
        Notificacion notificacion = new Notificacion();

        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setRolDestino("CLIENTE");
        notificacion.setLeida(false);
        notificacion.setCliente(cita.getCliente());
        notificacion.setCita(cita);

        return notificacionRepository.save(notificacion);
    }

    @Override
    public Notificacion crearNotificacionBarbero(String titulo, String mensaje, String tipo, Cita cita) {
        Notificacion notificacion = new Notificacion();

        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setRolDestino("BARBERO");
        notificacion.setLeida(false);
        notificacion.setBarbero(cita.getBarbero());
        notificacion.setCita(cita);

        return notificacionRepository.save(notificacion);
    }

    @Override
    public Notificacion generarRecordatorioCita(Cita cita) {
        String nombreBarbero = cita.getBarbero() != null ? cita.getBarbero().getNombre() : "barbero asignado";
        String nombreServicio = cita.getServicio() != null ? cita.getServicio().getNombre() : "servicio reservado";

        String mensaje = "Recuerda que tienes una cita programada para el "
                + cita.getDia()
                + " a las "
                + cita.getHora()
                + ". Servicio: "
                + nombreServicio
                + ". Barbero: "
                + nombreBarbero
                + ".";

        return crearNotificacionCliente("Recordatorio de cita", mensaje, "RECORDATORIO", cita);
    }

    @Override
    public Notificacion generarNotificacionCitaModificada(Cita cita) {
        String nombreBarbero = cita.getBarbero() != null ? cita.getBarbero().getNombre() : "barbero asignado";
        String nombreServicio = cita.getServicio() != null ? cita.getServicio().getNombre() : "servicio reservado";

        String mensaje = "Tu cita fue modificada. Nueva información: "
                + cita.getDia()
                + " a las "
                + cita.getHora()
                + ". Servicio: "
                + nombreServicio
                + ". Barbero: "
                + nombreBarbero
                + ".";

        return crearNotificacionCliente("Cita modificada", mensaje, "CITA_MODIFICADA", cita);
    }

    @Override
    public Notificacion generarNotificacionCitaCancelada(Cita cita) {
        String mensaje = "Tu cita del "
                + cita.getDia()
                + " a las "
                + cita.getHora()
                + " fue cancelada.";

        return crearNotificacionCliente("Cita cancelada", mensaje, "CITA_CANCELADA", cita);
    }

    @Override
    public boolean existeNotificacion(Long citaId, String tipo) {
        return notificacionRepository.existsByCitaIdAndTipo(citaId, tipo);
    }

    @Override
    public List<Notificacion> listarPorBarbero(Long barberoId) {
    return notificacionRepository.findByBarberoIdOrderByFechaCreacionDesc(barberoId);
    }
}