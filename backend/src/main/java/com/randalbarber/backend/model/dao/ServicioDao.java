package com.randalbarber.backend.model.dao;

import java.util.List;

import com.randalbarber.backend.model.entity.Servicio;

public interface ServicioDao {
    List<Servicio> listarServicios();
    Servicio guardarServicio(Servicio servicio);
    Servicio actualizarServicio(Long id, Servicio servicio);
    void eliminarServicio(Long id);
}
