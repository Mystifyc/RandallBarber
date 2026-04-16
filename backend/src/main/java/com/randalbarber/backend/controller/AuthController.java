package com.randalbarber.backend.controller;

import java.util.Locale;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.randalbarber.backend.controller.dto.LoginRequest;
import com.randalbarber.backend.controller.dto.LoginResponse;
import com.randalbarber.backend.model.entity.Administrador;
import com.randalbarber.backend.model.entity.Barbero;
import com.randalbarber.backend.model.entity.Cliente;
import com.randalbarber.backend.repository.AdministradorRepository;
import com.randalbarber.backend.repository.BarberoRepository;
import com.randalbarber.backend.repository.ClienteRepository;
import com.randalbarber.backend.controller.dto.RegisterClienteRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AdministradorRepository administradorRepository;
    private final BarberoRepository barberoRepository;
    private final ClienteRepository clienteRepository;

    public AuthController(
            AdministradorRepository administradorRepository,
            BarberoRepository barberoRepository,
            ClienteRepository clienteRepository) {
        this.administradorRepository = administradorRepository;
        this.barberoRepository = barberoRepository;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getCorreo() == null || request.getPassword() == null || request.getRol() == null) {
            return ResponseEntity.badRequest().body("Correo, password y rol son obligatorios");
        }

        String rol = request.getRol().trim().toUpperCase(Locale.ROOT);

        switch (rol) {
            case "ADMIN":
                return loginAdmin(request.getCorreo(), request.getPassword());
            case "BARBERO":
                return loginBarbero(request.getCorreo(), request.getPassword());
            case "CLIENTE":
                return loginCliente(request.getCorreo(), request.getPassword());
            default:
                return ResponseEntity.badRequest().body("Rol no válido");
        }
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<?> registrarCliente(@RequestBody RegisterClienteRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()
                || request.getTelefono() == null || request.getTelefono().trim().isEmpty()
                || request.getCorreo() == null || request.getCorreo().trim().isEmpty()
                || request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Todos los campos son obligatorios");
        }

        boolean correoExisteEnClientes = clienteRepository.findByCorreo(request.getCorreo()).isPresent();
        boolean correoExisteEnBarberos = barberoRepository.findByCorreo(request.getCorreo()).isPresent();
        boolean correoExisteEnAdmins = administradorRepository.findByCorreo(request.getCorreo()).isPresent();

        if (correoExisteEnClientes || correoExisteEnBarberos || correoExisteEnAdmins) {
            return ResponseEntity.badRequest().body("Ya existe un usuario con ese correo");
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre().trim());
        cliente.setTelefono(request.getTelefono().trim());
        cliente.setCorreo(request.getCorreo().trim().toLowerCase());
        cliente.setPassword(request.getPassword().trim());

        Cliente guardado = clienteRepository.save(cliente);

        return ResponseEntity.ok(
                new LoginResponse(
                        guardado.getId(),
                        guardado.getNombre(),
                        guardado.getCorreo(),
                        "CLIENTE"
                )
        );
    }

    private ResponseEntity<?> loginAdmin(String correo, String password) {
        Administrador admin = administradorRepository.findByCorreo(correo)
                .orElse(null);

        if (admin == null || admin.getPassword() == null || !admin.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        return ResponseEntity.ok(
                new LoginResponse(admin.getId(), admin.getNombre(), admin.getCorreo(), "ADMIN"));
    }

    private ResponseEntity<?> loginBarbero(String correo, String password) {
        Barbero barbero = barberoRepository.findByCorreo(correo)
                .orElse(null);

        if (barbero == null || barbero.getPassword() == null || !barbero.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        return ResponseEntity.ok(
                new LoginResponse(barbero.getId(), barbero.getNombre(), barbero.getCorreo(), "BARBERO"));
    }

    private ResponseEntity<?> loginCliente(String correo, String password) {
        Cliente cliente = clienteRepository.findByCorreo(correo)
                .orElse(null);

        if (cliente == null || cliente.getPassword() == null || !cliente.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        return ResponseEntity.ok(
                new LoginResponse(cliente.getId(), cliente.getNombre(), cliente.getCorreo(), "CLIENTE"));
    }
}