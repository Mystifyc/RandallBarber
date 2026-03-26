package com.randalbarber.backend.model.dao;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.randalbarber.backend.model.entity.Barbero;
import com.randalbarber.backend.repository.BarberoRepository;


@Service
public class BarberoDaoImpl implements BarberoDao {

    private final BarberoRepository barberoRepository;

    public BarberoDaoImpl(BarberoRepository barberoRepository) {
        this.barberoRepository = barberoRepository;
    }

    @Override
    public List<Barbero> listarTodos() {
        return barberoRepository.findAll();
    }

    @Override
    public List<Barbero> listarActivos() {
        return barberoRepository.findByActivoTrue();
    }

    @Override
    public Optional<Barbero> buscarPorId(Long id) {
        return barberoRepository.findById(id);
    }

    @Override
    public Barbero guardar(Barbero barbero) {
        if (barbero.getActivo() == null) {
            barbero.setActivo(true);
        }
        return barberoRepository.save(barbero);
    }

    @Override
    public Barbero actualizar(Long id, Barbero barbero) {
        return barberoRepository.findById(id).map(b -> {
            b.setNombre(barbero.getNombre());
            b.setEspecialidad(barbero.getEspecialidad());
            b.setTelefono(barbero.getTelefono());
            b.setActivo(barbero.getActivo());
            return barberoRepository.save(b);
        }).orElseThrow(() -> new RuntimeException("Barbero no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (!barberoRepository.existsById(id)) {
            throw new RuntimeException("Barbero no encontrado con id: " + id);
        }
        barberoRepository.deleteById(id);
    }
}