package com.randalbarber.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.randalbarber.backend.model.dao.AdministradorDao;
import com.randalbarber.backend.model.entity.Administrador;

@RestController
@RequestMapping("/api/administrador")
@CrossOrigin(origins = "http://localhost:5173")
public class AdministradorController {

    private final AdministradorDao administradorservice;

    public AdministradorController(AdministradorDao administradorservice) {
        this.administradorservice = administradorservice;
    }

    @PostMapping
    public ResponseEntity<Administrador> guardar(@RequestBody Administrador administrador) {
        Administrador nuevo = administradorservice.guardarAdministrador(administrador);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAdmin(@PathVariable Long id, @RequestBody Administrador administrador) {
        try {
            Administrador actualizado = administradorservice.actualizarAdministrador(id, administrador);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAdmin(@PathVariable Long id) {
        try {
            administradorservice.eliminarAdministrador(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
