package com.randalbarber.backend.model.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.randalbarber.backend.model.entity.Cita;
import com.randalbarber.backend.repository.CitaRepository;

@Service
public class RecordatorioCitaService {

    private final CitaRepository citaRepository;
    private final NotificacionDao notificacionDao;

    public RecordatorioCitaService(
            CitaRepository citaRepository,
            NotificacionDao notificacionDao
    ) {
        this.citaRepository = citaRepository;
        this.notificacionDao = notificacionDao;
    }

    @Scheduled(fixedRate = (60000*5))
    public void generarRecordatorios() {
        LocalDate manana = LocalDate.now().plusDays(1);

        List<Cita> citas = citaRepository.findByDiaAndEstado(manana, "ACTIVA");

        for (Cita cita : citas) {
            boolean yaExiste = notificacionDao.existeNotificacion(
                    cita.getId(),
                    "RECORDATORIO"
            );

            if (!yaExiste) {
                notificacionDao.generarRecordatorioCita(cita);
            }
        }
    }
}
