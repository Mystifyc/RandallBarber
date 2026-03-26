package com.randalbarber.backend.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "administradores")
public class Administrador extends Usuario {

    @Column(name = "correo")
    private String correo;

    public Administrador(Long Id, String Nombre, String Telefono, String Correo){
        super(Id, Nombre, Telefono);
        this.correo = Correo;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    
}
