package com.randalbarber.backend.model.dao;

import java.util.List;
import java.util.Optional;
import com.randalbarber.backend.model.entity.Barbero;

public interface BarberoDao {
    List<Barbero> listarTodos();
    List<Barbero> listarActivos();
    Optional<Barbero> buscarPorId(Long id);
    Barbero guardar(Barbero barbero);
    Barbero actualizar(Long id, Barbero barbero);
    void eliminar(Long id);
}