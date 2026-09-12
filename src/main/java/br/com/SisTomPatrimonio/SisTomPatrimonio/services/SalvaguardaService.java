package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.SalvaguardaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Salvaguarda;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.SalvaguardaRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SalvaguardaService {

    private final SalvaguardaRepository repository;
    private final BemCulturalRepository bemCulturalRepository;
    private final UsuarioRepository usuarioRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public SalvaguardaDTO criar(SalvaguardaDTO dto) {
        if (dto == null) {
            throw new RegraNegocioRunTime("Dados do plano de salvaguarda não informados.");
        }

        if (dto.getPlanoAcao() == null || dto.getPlanoAcao().isBlank()) {
            throw new RegraNegocioRunTime("O plano de ação deve ser informado.");
        }

        if (dto.getBemCulturalId() == null) {
            throw new RegraNegocioRunTime("O bem cultural deve ser informado.");
        }

        BemCultural bem = bemCulturalRepository.findById(dto.getBemCulturalId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));

        // Regra de Negocio RN02: Exclusividade de salvaguarda para bens imateriais
        if (!"IMATERIAL".equalsIgnoreCase(bem.getNatureza())) {
            throw new RegraNegocioRunTime("Planos de salvaguarda destinam-se exclusivamente a bens de natureza IMATERIAL.");
        }

        Usuario responsavel = null;
        if (dto.getResponsavelId() != null) {
            responsavel = usuarioRepository.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Responsável não encontrado."));
        }

        Salvaguarda entity = Salvaguarda.builder()
                .bemCultural(bem)
                .planoAcao(dto.getPlanoAcao())
                .status(dto.getStatus() != null ? dto.getStatus() : br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda.PLANEJADO)
                .dataInicio(dto.getDataInicio())
                .dataPrevisaoFim(dto.getDataPrevisaoFim())
                .dataConclusao(dto.getDataConclusao())
                .responsavel(responsavel)
                .build();

        Salvaguarda salvo = repository.save(entity);

        eventPublisher.publishEvent(AuditoriaEvent.builder()
                .entidade("SALVAGUARDA")
                .entidadeId(salvo.getId())
                .acao("CRIACAO")
                .usuarioId(responsavel != null ? responsavel.getId() : null)
                .dadosNovos(Map.of("bemId", bem.getId(), "planoAcao", salvo.getPlanoAcao()))
                .origem("SALVAGUARDA_SERVICE")
                .build());

        return toDto(salvo);
    }

    @Transactional(readOnly = true)
    public List<SalvaguardaDTO> listarPorBem(UUID bemId) {
        return repository.findByBemCulturalId(bemId).stream()
                .map(this::toDto)
                .toList();
    }

    private SalvaguardaDTO toDto(Salvaguarda entity) {
        return new SalvaguardaDTO(
                entity.getId(),
                entity.getBemCultural().getId(),
                entity.getPlanoAcao(),
                entity.getStatus(),
                entity.getDataInicio(),
                entity.getDataPrevisaoFim(),
                entity.getDataConclusao(),
                entity.getResponsavel() != null ? entity.getResponsavel().getId() : null);
    }
}