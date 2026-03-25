package com.randalbarber.backend.model.dao;

import com.randalbarber.backend.model.entity.Administrador;
import com.randalbarber.backend.repository.AdministradorRepository;

public class AdministradorDaoImp implements AdministradorDao {

    private AdministradorRepository administradorRepository;

    @Override
    public Administrador guardarAdministrador(Administrador administrador){
        return administradorRepository.save(administrador);
    }

    @Override
    public Administrador actualizarAdministrador(Long id, Administrador administrador){
        return administradorRepository.findById(id).map(a -> {
            a.setNombre(administrador.getNombre());
            a.setTelefono(administrador.getTelefono());
            a.setTelefono(administrador.getTelefono());
            return administradorRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Barbero no encontrado con id: " + id));
    }

    @Override
    public void eliminarAdministrador(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Barbero no encontrado con id: " + id);
        }
        administradorRepository.deleteById(id);
    }
}
