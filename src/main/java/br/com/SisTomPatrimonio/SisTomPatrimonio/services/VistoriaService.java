package br.com.SisTomPatrimonio.SisTomPatrimonio.services;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.VistoriaDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Vistoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusVistoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.VistoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VistoriaService {

    private final VistoriaRepository vistoriaRepository;
    private final BemCulturalRepository bemCulturalRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Transactional
    public VistoriaDTOs.Response criar(VistoriaDTOs.Request request) {
        BemCultural bem = bemCulturalRepository.findById(request.getBemId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));

        Usuario responsavel = null;
        if (request.getResponsavelId() != null) {
            responsavel = usuarioRepository.findById(request.getResponsavelId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Usuário responsável não encontrado."));
        }

        Organizacao org = null;
        if (request.getOrganizacaoId() != null) {
            org = organizacaoRepository.findById(request.getOrganizacaoId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Organização não encontrada."));
        }

        Vistoria vistoria = Vistoria.builder()
                .codigo(request.getCodigo())
                .bem(bem)
                .status(StatusVistoria.PLANEJADA.name())
                .agendadaEm(request.getAgendadaEm())
                .responsavel(responsavel)
                .organizacao(org)
                .situacaoConservacao(request.getSituacaoConservacao())
                .nivelRisco(request.getNivelRisco())
                .resumo(request.getResumo())
                .recomendacao(request.getRecomendacao())
                .proximaVistoria(request.getProximaVistoria())
                .equipe(request.getEquipe())
                .patologias(request.getPatologias())
                .homologada(false)
                .build();

        Vistoria salva = vistoriaRepository.save(vistoria);
        return converterParaResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<VistoriaDTOs.Response> listarPorBem(UUID bemId) {
        return vistoriaRepository.findByBemIdOrderByAgendadaEmDesc(bemId).stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @Transactional
    public VistoriaDTOs.Response homologar(UUID vistoriaId, UUID usuarioHomologadorId) {
        Vistoria vistoria = vistoriaRepository.findById(vistoriaId)
                .orElseThrow(() -> new RegraNegocioRunTime("Vistoria não encontrada."));

        Usuario homologador = usuarioRepository.findById(usuarioHomologadorId)
                .orElseThrow(() -> new RegraNegocioRunTime("Usuário homologador não encontrado."));

        vistoria.homologar(homologador);
        Vistoria salva = vistoriaRepository.save(vistoria);

        eventPublisher.publishEvent(br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent.builder()
                .entidade("VISTORIA")
                .entidadeId(salva.getId())
                .acao("HOMOLOGACAO")
                .usuarioId(homologador.getId())
                .dadosNovos(java.util.Map.of("status", salva.getStatus(), "homologada", true))
                .origem("VISTORIA_SERVICE")
                .build());

        return converterParaResponse(salva);
    }

    private VistoriaDTOs.Response converterParaResponse(Vistoria vistoria) {
        return VistoriaDTOs.Response.builder()
                .id(vistoria.getId())
                .codigo(vistoria.getCodigo())
                .bemId(vistoria.getBem().getId())
                .bemNome(vistoria.getBem().getNome())
                .status(vistoria.getStatus())
                .responsavelNome(vistoria.getResponsavel() != null ? vistoria.getResponsavel().getNome() : null)
                .agendadaEm(vistoria.getAgendadaEm())
                .realizadaEm(vistoria.getRealizadaEm())
                .situacaoConservacao(vistoria.getSituacaoConservacao())
                .nivelRisco(vistoria.getNivelRisco())
                .homologada(vistoria.getHomologada())
                .criadoEm(vistoria.getCriadoEm())
                .build();
    }
}