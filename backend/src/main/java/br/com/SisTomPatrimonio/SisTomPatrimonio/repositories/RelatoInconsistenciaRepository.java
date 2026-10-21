package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.RelatoInconsistencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RelatoInconsistenciaRepository extends JpaRepository<RelatoInconsistencia, UUID> {
}
