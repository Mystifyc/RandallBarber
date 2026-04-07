package com.randalbarber.backend.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.randalbarber.backend.model.dao.ServicioDao;
import com.randalbarber.backend.model.entity.Servicio;

@RestController
@RequestMapping("/api/servicio")
@CrossOrigin(origins = "http://localhost:5173")
public class ServicioController {

    private  ServicioDao servicioDao;

    public ServicioController(ServicioDao servicioDao) {
        this.servicioDao = servicioDao;
    }

    @GetMapping
    public List<Servicio> listarServi() {
        return servicioDao.listarServicios();
    }


    @PostMapping
    public ResponseEntity<Servicio> guardarServi(@RequestBody Servicio servicio) {
        Servicio nuevo = servicioDao.guardarServicio(servicio);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizarServi(@PathVariable Long id, @RequestBody Servicio servicio) {
        try {
            Servicio actualizado = servicioDao.actualizarServicio(id, servicio);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Servicio> eliminar(@PathVariable Long id) {
        try {
            servicioDao.eliminarServicio(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
