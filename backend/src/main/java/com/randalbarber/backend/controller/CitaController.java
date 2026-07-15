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
import org.springframework.web.bind.annotation.RequestHeader;
import com.randalbarber.backend.controller.dto.HistorialCitaClienteResponse;
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

    @GetMapping("/filtrar")
    public ResponseEntity<?> filtrarCitas(
            @RequestHeader(value = "X-Rol-Usuario", required = false) String rol,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long barberoId,
            @RequestParam(required = false) String dia
    ) {
        if (!esAdmin(rol)) {
            return ResponseEntity.status(403).body("Solo el administrador puede filtrar citas.");
        }

        LocalDate fecha = null;

        if (dia != null && !dia.isBlank()) {
            fecha = LocalDate.parse(dia);
        }

        List<Cita> citas = citaDao.filtrarCitas(clienteId, barberoId, fecha);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/canceladas")
    public ResponseEntity<?> obtenerCitasCanceladas(
            @RequestHeader(value = "X-Rol-Usuario", required = false) String rol
    ) {
        if (!esAdmin(rol)) {
            return ResponseEntity.status(403).body("Solo el administrador puede consultar citas canceladas.");
        }

        List<Cita> canceladas = citaDao.obtenerCitasCanceladas();
        return ResponseEntity.ok(canceladas);
    }

    private boolean esAdmin(String rol) {
        return rol != null && rol.equalsIgnoreCase("ADMIN");
    }

    private boolean esCliente(String rol) {
    return rol != null && rol.equalsIgnoreCase("CLIENTE");
    }

    private boolean esBarbero(String rol) {
    return rol != null && rol.equalsIgnoreCase("BARBERO");
    }

    @PostMapping
    public ResponseEntity<Cita> guardaCi(@RequestBody Cita cita) {
        Cita nuevo = citaDao.guardarCita(cita);
        return ResponseEntity.ok(nuevo);
    }

    @GetMapping("/cliente/{clienteId}/historial")
    public ResponseEntity<?> obtenerHistorialCliente(@PathVariable Long clienteId) {
        try {
            List<HistorialCitaClienteResponse> historial = citaDao.obtenerHistorialPorCliente(clienteId)
                    .stream()
                    .map(cita -> new HistorialCitaClienteResponse(
                            cita.getId(),
                            cita.getDia(),
                            cita.getHora(),
                            cita.getServicio() != null ? cita.getServicio().getNombre() : "Sin servicio",
                            cita.getEstado()
                    ))
                    .toList();

            return ResponseEntity.ok(historial);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }@GetMapping("/cliente/{clienteId}/activas")
    public ResponseEntity<?> obtenerCitasActivasCliente(
            @RequestHeader(value = "X-Rol-Usuario", required = false) String rol,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @PathVariable Long clienteId
    ) {
        if (!esCliente(rol)) {
            return ResponseEntity.status(403).body("Solo el cliente puede consultar sus citas activas.");
        }

        if (usuarioId == null || !usuarioId.equals(clienteId)) {
            return ResponseEntity.status(403).body("No puedes consultar citas de otro cliente.");
        }

        List<Cita> citas = citaDao.obtenerCitasActivasPorCliente(clienteId);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/barbero/{barberoId}/historial")
    public ResponseEntity<?> obtenerHistorialBarbero(
            @RequestHeader(value = "X-Rol-Usuario", required = false) String rol,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @PathVariable Long barberoId
    ) {
        if (!esBarbero(rol)) {
            return ResponseEntity.status(403).body("Solo el barbero puede consultar este historial.");
        }

        if (usuarioId == null || !usuarioId.equals(barberoId)) {
            return ResponseEntity.status(403).body("No puedes consultar citas de otro barbero.");
        }

        List<Cita> historial = citaDao.obtenerHistorialPorBarbero(barberoId);
        return ResponseEntity.ok(historial);
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
