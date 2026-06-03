package com.randalbarber.backend.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class HistorialCitaClienteResponse {

    private Long id;
    private LocalDate dia;
    private LocalTime hora;
    private String servicio;
    private String estado;

    public HistorialCitaClienteResponse() {
    }

    public HistorialCitaClienteResponse(Long id, LocalDate dia, LocalTime hora, String servicio, String estado) {
        this.id = id;
        this.dia = dia;
        this.hora = hora;
        this.servicio = servicio;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDia() {
        return dia;
    }

    public LocalTime getHora() {
        return hora;
    }

    public String getServicio() {
        return servicio;
    }

    public String getEstado() {
        return estado;
    }
}
