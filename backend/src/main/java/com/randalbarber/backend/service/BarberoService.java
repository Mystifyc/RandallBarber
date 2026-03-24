package com.randalbarber.backend.service;

import java.util.List;
import java.util.Optional;
import com.randalbarber.backend.entity.Barbero;

public interface BarberoService {
    List<Barbero> listarTodos();
    List<Barbero> listarActivos();
    Optional<Barbero> buscarPorId(Long id);
    Barbero guardar(Barbero barbero);
    Barbero actualizar(Long id, Barbero barbero);
    void eliminar(Long id);
}