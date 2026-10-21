package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentoRepository extends JpaRepository<Documento, UUID> {

    List<Documento> findByBemId(UUID bemId);

    List<Documento> findByBemIdAndPublicacaoAutorizadaTrue(UUID bemId);

    List<Documento> findByVistoriaId(UUID vistoriaId);

    Optional<Documento> findBySha256(String sha256);
}