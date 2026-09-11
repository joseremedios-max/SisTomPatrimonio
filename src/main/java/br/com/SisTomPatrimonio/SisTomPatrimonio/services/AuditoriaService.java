package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.AuditoriaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    @Transactional(readOnly = true)
    public Page<AuditoriaDTO> buscarPorEntidade(String entidade, UUID entidadeId, Pageable pageable) {
        return auditoriaRepository.findByEntidadeAndEntidadeId(entidade, entidadeId, pageable)
                .map(this::converterParaDTO);
    }

    private AuditoriaDTO converterParaDTO(Auditoria a) {
        return AuditoriaDTO.builder()
                .id(a.getId())
                .usuarioId(a.getUsuario() != null ? a.getUsuario().getId() : null)
                .usuarioNome(a.getUsuario() != null ? a.getUsuario().getNome() : null)
                .ocorridoEm(a.getOcorridoEm())
                .acao(a.getAcao())
                .entidade(a.getEntidade())
                .entidadeId(a.getEntidadeId())
                .dadosAnteriores(a.getDadosAnteriores())
                .dadosNovos(a.getDadosNovos())
                .origem(a.getOrigem())
                .correlationId(a.getCorrelationId())
                .build();
    }
}