package br.com.SisTomPatrimonio.SisTomPatrimonio.services;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalRequestDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.LocalizacaoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.LocalizacaoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BemCulturalService {

    private final BemCulturalRepository bemRepository;
    private final LocalizacaoBemRepository localizacaoRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional
    public BemCulturalResponseDTO cadastrarBem(BemCulturalRequestDTO dto, UUID usuarioAutenticadoId) {
        Organizacao org = organizacaoRepository.findById(dto.getOrganizacaoResponsavelId())
                .orElseThrow(() -> new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Organização não encontrada."));

        Usuario usuario = usuarioRepository.findById(usuarioAutenticadoId)
                .orElseThrow(() -> new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Usuário não encontrado."));

        BemCultural bem = BemCultural.builder()
                .codigo(dto.getCodigo())
                .natureza(dto.getNatureza().name())
                .nome(dto.getNome())
                .resumoPublico(dto.getResumoPublico())
                .descricao(dto.getDescricao())
                .observacoesInternas(dto.getObservacoesInternas())
                .status(StatusBemCultural.RASCUNHO.name())
                .organizacaoResponsavel(org)
                .tipoImovel(dto.getTipoImovel())
                .tipologiaArquitetonica(dto.getTipologiaArquitetonica())
                .areaConstruidaM2(dto.getAreaConstruidaM2())
                .dadosEspecificos(dto.getDadosEspecificos())
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build();

        BemCultural bemSalvo = bemRepository.save(bem);

        // Processa Geoprocessamento se houver coordenadas informadas
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            Point pontoGeografico = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));

            LocalizacaoBem localizacao = LocalizacaoBem.builder()
                    .bem(bemSalvo)
                    .logradouro(dto.getLogradouro())
                    .numero(dto.getNumero())
                    .bairro(dto.getBairro())
                    .geom(pontoGeografico)
                    .epsg(4326)
                    .principal(true)
                    .build();

            localizacaoRepository.save(localizacao);
        }

        eventPublisher.publishEvent(br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent.builder()
                .entidade("BEM_CULTURAL")
                .entidadeId(bemSalvo.getId())
                .acao("CRIACAO")
                .usuarioId(usuario.getId())
                .dadosNovos(java.util.Map.of("codigo", bemSalvo.getCodigo(), "nome", bemSalvo.getNome(), "natureza", bemSalvo.getNatureza()))
                .origem("BEM_CULTURAL_SERVICE")
                .build());

        return converterParaResponseDTO(bemSalvo, dto.getLatitude(), dto.getLongitude());
    }

    @Transactional
    public BemCulturalResponseDTO publicar(UUID bemId, UUID usuarioId) {
        BemCultural bem = bemRepository.findById(bemId)
                .orElseThrow(() -> new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Bem cultural não encontrado."));

        bem.publicar();
        BemCultural salvo = bemRepository.save(bem);

        eventPublisher.publishEvent(br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent.builder()
                .entidade("BEM_CULTURAL")
                .entidadeId(salvo.getId())
                .acao("PUBLICACAO")
                .usuarioId(usuarioId)
                .dadosNovos(java.util.Map.of("status", salvo.getStatus(), "publicadoEm", salvo.getPublicadoEm()))
                .origem("BEM_CULTURAL_SERVICE")
                .build());

        return converterParaResponseDTO(salvo, null, null);
    }

    @Transactional
    public BemCulturalResponseDTO arquivar(UUID bemId, UUID usuarioId) {
        BemCultural bem = bemRepository.findById(bemId)
                .orElseThrow(() -> new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Bem cultural não encontrado."));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Usuário não encontrado."));

        bem.arquivar(usuario);
        BemCultural salvo = bemRepository.save(bem);

        eventPublisher.publishEvent(br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent.builder()
                .entidade("BEM_CULTURAL")
                .entidadeId(salvo.getId())
                .acao("ARQUIVAMENTO")
                .usuarioId(usuario.getId())
                .dadosNovos(java.util.Map.of("status", salvo.getStatus(), "arquivadoEm", salvo.getArquivadoEm()))
                .origem("BEM_CULTURAL_SERVICE")
                .build());

        return converterParaResponseDTO(salvo, null, null);
    }

    @Transactional(readOnly = true)
    public Page<BemCulturalResponseDTO> buscarPorProximidade(double latitude, double longitude, double raioMetros, Pageable pageable) {
        Point pontoBusca = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        return bemRepository.buscarPorProximidade(pontoBusca, raioMetros, pageable)
                .map(bem -> converterParaResponseDTO(bem, null, null));
    }

    private BemCulturalResponseDTO converterParaResponseDTO(BemCultural bem, Double lat, Double lng) {
        return BemCulturalResponseDTO.builder()
                .id(bem.getId())
                .codigo(bem.getCodigo())
                .natureza(NaturezaBem.valueOf(bem.getNatureza()))
                .nome(bem.getNome())
                .resumoPublico(bem.getResumoPublico())
                .descricao(bem.getDescricao())
                .status(StatusBemCultural.valueOf(bem.getStatus()))
                .organizacaoNome(bem.getOrganizacaoResponsavel().getNome())
                .latitude(lat)
                .longitude(lng)
                .areaConstruidaM2(bem.getAreaConstruidaM2())
                .dadosEspecificos(bem.getDadosEspecificos())
                .criadoEm(bem.getCriadoEm())
                .build();
    }
}