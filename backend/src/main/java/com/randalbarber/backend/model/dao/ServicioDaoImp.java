/*package com.randalbarber.backend.model.dao;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.randalbarber.backend.model.entity.Servicio;
import com.randalbarber.backend.repository.ServicioRepository;

@Repository
public class ServicioDaoImp implements ServicioDao {

    private final ServicioRepository servicioRepository;

    public ServicioDaoImp(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    @Override
    public Servicio guardarServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio actualizarServicio(Long id, Servicio servicio) {
        return servicioRepository.findById(id).map(s -> {
            s.setNombre(servicio.getNombre());
            s.setDuracion(servicio.getDuracion());
            s.setPrecio(servicio.getPrecio());
            return servicioRepository.save(s);
        }).orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
    }

    @Override
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }

    @Override
    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }
}*/

package com.randalbarber.backend.model.dao;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import com.randalbarber.backend.model.entity.Servicio;
import com.randalbarber.backend.repository.ServicioRepository;

@Repository
public class ServicioDaoImp implements ServicioDao {

    private final ServicioRepository servicioRepository;

    public ServicioDaoImp(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    @Override
    public Servicio guardarServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio actualizarServicio(Long id, Servicio servicio) {
        return servicioRepository.findById(id).map(s -> {
            s.setNombre(servicio.getNombre());
            s.setDuracion(servicio.getDuracion());
            s.setPrecio(servicio.getPrecio());
            return servicioRepository.save(s);
        }).orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
    }

    @Override
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }

    @Override
    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    @Override
    public Optional<Servicio> buscarPorId(Long id) {
        return servicioRepository.findById(id);
    }
}