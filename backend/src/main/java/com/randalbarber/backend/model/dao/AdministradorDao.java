package com.randalbarber.backend.model.dao;

import com.randalbarber.backend.model.entity.Administrador;

public interface AdministradorDao {
    Administrador guardarAdministrador(Administrador administrador);
    Administrador actualizarAdministrador(Long id, Administrador administrador);
    void eliminarAdministrador(Long id);
}
