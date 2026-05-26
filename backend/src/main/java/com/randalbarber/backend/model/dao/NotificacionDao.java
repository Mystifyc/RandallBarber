package com.randalbarber.backend.model.dao;

import java.util.List;

import com.randalbarber.backend.model.entity.Cita;
import com.randalbarber.backend.model.entity.Notificacion;

public interface NotificacionDao {

    List<Notificacion> listarNotificacionesAdmin();

    List<Notificacion> listarNoLeidasAdmin();

    List<Notificacion> listarPorCliente(Long clienteId);

    Notificacion crearNotificacion(String titulo, String mensaje, String tipo, String rolDestino);

    Notificacion crearNotificacionCliente(
            String titulo,
            String mensaje,
            String tipo,
            Cita cita
    );

    List<Notificacion> listarPorBarbero(Long barberoId);

    Notificacion crearNotificacionBarbero(
        String titulo,
        String mensaje,
        String tipo,
        Cita cita
    );

    Notificacion generarRecordatorioCita(Cita cita);

    Notificacion generarNotificacionCitaModificada(Cita cita);

    Notificacion generarNotificacionCitaCancelada(Cita cita);

    boolean existeNotificacion(Long citaId, String tipo);

    Notificacion marcarComoLeida(Long id);

    void eliminarNotificacion(Long id);
}