package com.randalbarber.backend.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "barberos")
public class Barbero extends Usuario {

    @Column(nullable = false)
    private String especialidad;

    private Boolean activo;

    public Barbero() {
        super();
    }

    public Barbero(Long id, String nombre, String telefono, String especialidad, Boolean activo) {
        super(id, nombre, telefono);
        this.especialidad = especialidad;
        this.activo = activo;

    }

    public String getEspecialidad() {
        return especialidad;
    }


    public Boolean getActivo() {
        return activo;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}