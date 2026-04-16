package com.randalbarber.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "administradores")
public class Administrador extends Usuario {

    @Column(name = "correo")
    private String correo;

    @Column(name = "password")
    private String password;

    public Administrador() {
        super();
    }

    public Administrador(Long id, String nombre, String telefono, String correo, String password) {
        super(id, nombre, telefono);
        this.correo = correo;
        this.password = password;
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