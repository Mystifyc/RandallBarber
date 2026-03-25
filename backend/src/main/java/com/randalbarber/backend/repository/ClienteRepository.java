package com.randalbarber.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
