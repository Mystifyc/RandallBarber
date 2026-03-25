package com.randalbarber.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.randalbarber.backend.model.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
