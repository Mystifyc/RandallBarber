package com.randalbarber.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.randalbarber.backend.model.entity.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio,Long> {
    
}
