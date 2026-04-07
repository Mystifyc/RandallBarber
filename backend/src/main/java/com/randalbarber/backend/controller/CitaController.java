package com.randalbarber.backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.randalbarber.backend.model.dao.CitaDao;
import com.randalbarber.backend.model.entity.Cita;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:5173")
public class CitaController {

    private CitaDao citaDao;

    public CitaController(CitaDao clienteDao) {
        this.citaDao = clienteDao;
    }

    @GetMapping
    public List<Cita> listarCi() {
        return citaDao.listarCitas();
    }

    @PostMapping
    public ResponseEntity<Cita> guardaCi(@RequestBody Cita cita) {
        Cita nuevo = citaDao.guardarCita(cita);
        return ResponseEntity.ok(nuevo);
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<LocalTime>> obtenerDisponibles(
        @RequestParam Long barberoId,
        @RequestParam String dia) {

        List<LocalTime> horas = citaDao.obtenerHorasDisponibles(
            barberoId,
            LocalDate.parse(dia)
        );

        return ResponseEntity.ok(horas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cita> actualizarCi(@PathVariable Long id, @RequestBody Cita cita) {
        try {
            Cita actualizado = citaDao.actualizarCita(id, cita);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCi(@PathVariable Long id) {
        try {
            citaDao.eliminarCita(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
