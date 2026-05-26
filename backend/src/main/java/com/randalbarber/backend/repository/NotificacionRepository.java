package com.randalbarber.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByRolDestinoOrderByFechaCreacionDesc(String rolDestino);

    List<Notificacion> findByRolDestinoAndLeidaFalseOrderByFechaCreacionDesc(String rolDestino);

    List<Notificacion> findByClienteIdOrderByFechaCreacionDesc(Long clienteId);

    List<Notificacion> findByBarberoIdOrderByFechaCreacionDesc(Long barberoId);

    boolean existsByCitaIdAndTipo(Long citaId, String tipo);
}