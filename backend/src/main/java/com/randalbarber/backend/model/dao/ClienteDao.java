package com.randalbarber.backend.model.dao;

import java.util.List;
import java.util.Optional;
import com.randalbarber.backend.model.entity.Cliente;

public interface ClienteDao {
    List<Cliente> listarClientes();
    Optional<Cliente> buscarPorId(Long id);
    Cliente guardar(Cliente cliente);
    Cliente actualizar(Long id, Cliente cliente);
    void eliminar(Long id);
}