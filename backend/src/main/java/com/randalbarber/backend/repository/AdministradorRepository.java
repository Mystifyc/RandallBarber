package com.randalbarber.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    
}
