package com.randalbarber.backend.model.dao;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.randalbarber.backend.model.entity.Cliente;
import com.randalbarber.backend.repository.ClienteRepository;


@Service
public class ClienteDaoImp implements ClienteDao{

    private final   ClienteRepository clienteRepository;

    public  ClienteDaoImp(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @Override
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente actualizar(Long id, Cliente cliente) {
        return clienteRepository.findById(id).map(b -> {
            b.setNombre(cliente.getNombre());
            b.setTelefono(cliente.getTelefono());
            b.setCorreo(cliente.getCorreo());;
            return clienteRepository.save(b);
        }).orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado con id: " + id);
        }
        clienteRepository.deleteById(id);
    }

}