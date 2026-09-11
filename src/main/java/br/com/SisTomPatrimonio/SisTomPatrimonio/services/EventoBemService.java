package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.EventoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.EventoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.EventoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EventoBemService {

    private final EventoBemRepository repository;
    private final BemCulturalRepository bemCulturalRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoBemService(EventoBemRepository repository, BemCulturalRepository bemCulturalRepository,
                            UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.bemCulturalRepository = bemCulturalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public EventoBemDTO criar(EventoBemDTO dto) {
        BemCultural bem = bemCulturalRepository.findById(dto.bemCulturalId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));

        EventoBem entity = EventoBem.builder()
                .bemCultural(bem)
                .tipoEvento(dto.tipo())
                .titulo(dto.titulo())
                .descricao(dto.descricao())
                .dataInicio(dto.dataInicio())
                .dataFim(dto.dataFim())
                .responsavel(usuarioRepository.findById(dto.responsavelId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Responsável não encontrado.")))
                .build();

        entity = repository.save(entity);
        return new EventoBemDTO(entity.getId(), bem.getId(), entity.getTipoEvento(), entity.getTitulo(), entity.getDescricao(), entity.getDataInicio(), entity.getDataFim(), entity.getResponsavel().getId());
    }

    @Transactional(readOnly = true)
    public List<EventoBemDTO> listarPorBem(UUID bemId) {
        return repository.findByBemCulturalId(bemId).stream()
                .map(e -> new EventoBemDTO(e.getId(), e.getBemCultural().getId(), e.getTipoEvento(), e.getTitulo(), e.getDescricao(), e.getDataInicio(), e.getDataFim(), e.getResponsavel().getId()))
                .toList();
    }
}