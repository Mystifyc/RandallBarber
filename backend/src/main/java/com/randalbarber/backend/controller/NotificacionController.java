package com.randalbarber.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.randalbarber.backend.model.dao.NotificacionDao;
import com.randalbarber.backend.model.entity.Notificacion;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacionController {

    private final NotificacionDao notificacionDao;

    public NotificacionController(NotificacionDao notificacionDao) {
        this.notificacionDao = notificacionDao;
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Notificacion>> listarNotificacionesAdmin() {
        return ResponseEntity.ok(notificacionDao.listarNotificacionesAdmin());
    }

    @GetMapping("/admin/no-leidas")
    public ResponseEntity<List<Notificacion>> listarNoLeidasAdmin() {
        return ResponseEntity.ok(notificacionDao.listarNoLeidasAdmin());
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long id) {
        try {
            Notificacion notificacion = notificacionDao.marcarComoLeida(id);
            return ResponseEntity.ok(notificacion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarNotificacion(@PathVariable Long id) {
        try {
            notificacionDao.eliminarNotificacion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Notificacion>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(notificacionDao.listarPorCliente(clienteId));
    }

    @GetMapping("/barbero/{barberoId}")
    public ResponseEntity<List<Notificacion>> listarPorBarbero(@PathVariable Long barberoId) {
        return ResponseEntity.ok(notificacionDao.listarPorBarbero(barberoId));
    }
}