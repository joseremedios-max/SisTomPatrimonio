package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.SalvaguardaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Salvaguarda;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.SalvaguardaRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SalvaguardaService {

    private final SalvaguardaRepository repository;
    private final BemCulturalRepository bemCulturalRepository;
    private final UsuarioRepository usuarioRepository;

    public SalvaguardaService(SalvaguardaRepository repository, BemCulturalRepository bemCulturalRepository,
                              UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.bemCulturalRepository = bemCulturalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public SalvaguardaDTO criar(SalvaguardaDTO dto) {
        BemCultural bem = bemCulturalRepository.findById(dto.getBemCulturalId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));

        Salvaguarda entity = Salvaguarda.builder()
                .bemCultural(bem)
                .planoAcao(dto.getPlanoAcao())
                .status(dto.getStatus())
                .dataInicio(dto.getDataInicio())
                .dataPrevisaoFim(dto.getDataPrevisaoFim())
                .dataConclusao(dto.getDataConclusao())
                .responsavel(usuarioRepository.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Responsável não encontrado.")))
                .build();

        entity = repository.save(entity);
            return toDto(entity);
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
                entity.getResponsavel().getId());
    }
}