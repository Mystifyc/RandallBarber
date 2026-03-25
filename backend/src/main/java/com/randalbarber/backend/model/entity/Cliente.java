package com.randalbarber.backend.model.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    @Column(nullable = false)
    private String correo;

    public Cliente() {
      super();
    }

  public Cliente(Long id, String nombre, String telefono, String correo) {
    super(id, nombre, telefono);
    this.correo = correo;
  }

  public String getCorreo() {
    return correo;
  }

  public void setCorreo(String correo) {
    this.correo = correo;
  }
   
}