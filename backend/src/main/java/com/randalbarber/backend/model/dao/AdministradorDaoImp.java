/*package com.randalbarber.backend.model.dao;

import org.springframework.stereotype.Repository;
import com.randalbarber.backend.model.entity.Administrador;
import com.randalbarber.backend.repository.AdministradorRepository;

@Repository
public class AdministradorDaoImp implements AdministradorDao {


    private  AdministradorRepository administradorRepository;

    @Override
    public Administrador guardarAdministrador(Administrador administrador){
        return administradorRepository.save(administrador);
    }

    @Override
    public Administrador actualizarAdministrador(Long id, Administrador administrador){
        return administradorRepository.findById(id).map(a -> {
            a.setNombre(administrador.getNombre());
            a.setTelefono(administrador.getTelefono());
            a.setCorreo(administrador.getCorreo());
            return administradorRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Admninistrador no encontrado con id: " + id));
    }

    @Override
    public void eliminarAdministrador(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado con id: " + id);
        }
        administradorRepository.deleteById(id);
    }
}*/

package com.randalbarber.backend.model.dao;

import org.springframework.stereotype.Repository;
import com.randalbarber.backend.model.entity.Administrador;
import com.randalbarber.backend.repository.AdministradorRepository;

@Repository
public class AdministradorDaoImp implements AdministradorDao {

    private final AdministradorRepository administradorRepository;

    public AdministradorDaoImp(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    @Override
    public Administrador guardarAdministrador(Administrador administrador) {
        return administradorRepository.save(administrador);
    }

    @Override
    public Administrador actualizarAdministrador(Long id, Administrador administrador) {
        return administradorRepository.findById(id).map(a -> {
            a.setNombre(administrador.getNombre());
            a.setTelefono(administrador.getTelefono());
            a.setCorreo(administrador.getCorreo());
            return administradorRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Administrador no encontrado con id: " + id));
    }

    @Override
    public void eliminarAdministrador(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado con id: " + id);
        }
        administradorRepository.deleteById(id);
    }
}