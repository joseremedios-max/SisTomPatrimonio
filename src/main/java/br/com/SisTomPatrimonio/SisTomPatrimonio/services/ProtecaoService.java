package br.com.SisTomPatrimonio.SisTomPatrimonio.services;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProtecaoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Protecao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProtecaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProtecaoService {

    private final ProtecaoRepository protecaoRepository;
    private final BemCulturalRepository bemCulturalRepository;
    private final OrganizacaoRepository organizacaoRepository;

    @Transactional
    public ProtecaoDTOs.Response criar(ProtecaoDTOs.Request request) {
        BemCultural bem = bemCulturalRepository.findById(request.getBemId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));

        Organizacao org = null;
        if (request.getOrganizacaoId() != null) {
            org = organizacaoRepository.findById(request.getOrganizacaoId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Organização não encontrada."));
        }

        Protecao protecao = Protecao.builder()
                .bem(bem)
                .numeroProcesso(request.getNumeroProcesso())
                .organizacao(org)
                .esfera(request.getEsfera())
                .fase(request.getFase())
                .tipoProtecao(request.getTipoProtecao())
                .dataAbertura(request.getDataAbertura())
                .dataDecisao(request.getDataDecisao())
                .atoNormativo(request.getAtoNormativo())
                .livroTombo(request.getLivroTombo())
                .numeroInscricao(request.getNumeroInscricao())
                .observacao(request.getObservacao())
                .vigente(true)
                .build();

        Protecao salva = protecaoRepository.save(protecao);
        return converterParaResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<ProtecaoDTOs.Response> listarPorBem(UUID bemId) {
        return protecaoRepository.findByBemId(bemId).stream()
                .map(this::converterParaResponse)
                .toList();
    }

    private ProtecaoDTOs.Response converterParaResponse(Protecao protecao) {
        return ProtecaoDTOs.Response.builder()
                .id(protecao.getId())
                .bemId(protecao.getBem().getId())
                .bemNome(protecao.getBem().getNome())
                .numeroProcesso(protecao.getNumeroProcesso())
                .esfera(protecao.getEsfera())
                .fase(protecao.getFase())
                .tipoProtecao(protecao.getTipoProtecao())
                .vigente(protecao.getVigente())
                .dataAbertura(protecao.getDataAbertura())
                .criadoEm(protecao.getCriadoEm())
                .build();
    }
}