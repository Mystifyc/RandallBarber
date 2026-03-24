package com.randalbarber.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.randalbarber.backend.entity.Barbero;
import com.randalbarber.backend.service.BarberoService;

@RestController
@RequestMapping("/api/barberos")
@CrossOrigin(origins = "http://localhost:5173")
public class BarberoController {

    private final BarberoService barberoService;

    public BarberoController(BarberoService barberoService) {
        this.barberoService = barberoService;
    }

    @GetMapping
    public List<Barbero> listarTodos() {
        return barberoService.listarTodos();
    }

    @GetMapping("/activos")
    public List<Barbero> listarActivos() {
        return barberoService.listarActivos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return barberoService.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Barbero> guardar(@RequestBody Barbero barbero) {
        Barbero nuevo = barberoService.guardar(barbero);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Barbero barbero) {
        try {
            Barbero actualizado = barberoService.actualizar(id, barbero);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            barberoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}