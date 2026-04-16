package com.randalbarber.backend.model.dao;

import java.util.List;
import java.util.Optional;
import com.randalbarber.backend.model.entity.Servicio;

public interface ServicioDao {
    Servicio guardarServicio(Servicio servicio);
    Servicio actualizarServicio(Long id, Servicio servicio);
    void eliminarServicio(Long id);
    List<Servicio> listarServicios();
    Optional<Servicio> buscarPorId(Long id);
}
