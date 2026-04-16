package com.randalbarber.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "barberos")
public class Barbero extends Usuario {

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "activo")
    private boolean activo;

    @Column(name = "correo")
    private String correo;

    @Column(name = "password")
    private String password;

    public Barbero() {
        super();
    }

    public Barbero(Long id, String nombre, String telefono, String especialidad, boolean activo, String correo, String password) {
        super(id, nombre, telefono);
        this.especialidad = especialidad;
        this.activo = activo;
        this.correo = correo;
        this.password = password;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}