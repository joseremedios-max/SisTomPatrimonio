package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalRequestDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalPublicoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.GeoJsonDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.LocalizacaoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.LocalizacaoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.List;
import org.locationtech.jts.geom.Geometry;

@Service
public class BemCulturalService {

    private static final List<String> STATUS_PUBLICOS = List.of(
            StatusBemCultural.PUBLICADO.name(),
            StatusBemCultural.TOMBADO.name()
    );

    private final BemCulturalRepository bemCulturalRepository;
    private final ObjectMapper objectMapper;
    private final LocalizacaoBemRepository localizacaoBemRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BemCulturalService(BemCulturalRepository bemCulturalRepository, ObjectMapper objectMapper) {
        this(bemCulturalRepository, objectMapper, null, null, null, null);
    }

    @Autowired
    public BemCulturalService(BemCulturalRepository bemCulturalRepository, ObjectMapper objectMapper,
                              LocalizacaoBemRepository localizacaoBemRepository,
                              OrganizacaoRepository organizacaoRepository,
                              UsuarioRepository usuarioRepository,
                              ApplicationEventPublisher eventPublisher) {
        this.bemCulturalRepository = bemCulturalRepository;
        this.objectMapper = objectMapper;
        this.localizacaoBemRepository = localizacaoBemRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public BemCultural criar(BemCulturalDTO dto) {
        validarRegrasEspecificas(dto);

        BemCultural bem = new BemCultural();
        bem.setNome(dto.getNome());
        bem.setNatureza(dto.getNatureza());
        bem.setClassificacao(dto.getClassificacao());

        // Converte o DTO específico (ex: DadosMaterialEdificadoDTO) em Map<String, Object> para o JSONB
        Map<String, Object> mapaDados = objectMapper.convertValue(
            dto.getDadosEspecificos(), new TypeReference<Map<String, Object>>() {});
        bem.setDadosEspecificos(mapaDados);

        BemCultural salvo = bemCulturalRepository.save(bem);
        publicarAuditoria("CRIACAO", salvo, null);
        return salvo;
    }

    @Transactional
    public BemCulturalResponseDTO cadastrarBem(BemCulturalRequestDTO dto, UUID usuarioId) {
        BemCultural bem = new BemCultural();
        bem.setCodigo(dto.getCodigo());
        bem.setNatureza(dto.getNatureza());
        bem.setNome(dto.getNome());
        bem.setResumoPublico(dto.getResumoPublico());
        bem.setDescricao(dto.getDescricao());
        bem.setObservacoesInternas(dto.getObservacoesInternas());
        bem.setDadosEspecificos(dto.getDadosEspecificos());
        bem.setStatus(StatusBemCultural.RASCUNHO.name());
        if (dto.getOrganizacaoResponsavelId() != null && organizacaoRepository != null) {
                bem.setOrganizacaoResponsavel(organizacaoRepository.findById(
                        Objects.requireNonNull(dto.getOrganizacaoResponsavelId(), "organizacaoResponsavelId"))
                .orElseThrow(() -> new RegraNegocioRunTime("Organização responsável não encontrada.")));
        }
        if (usuarioId != null && usuarioRepository != null) {
            bem.setCriadoPor(usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioRunTime("Usuário autenticado não encontrado.")));
            bem.setAtualizadoPor(bem.getCriadoPor());
        }

        BemCultural salvo = bemCulturalRepository.save(bem);
        persistirLocalizacao(dto, salvo);
        publicarAuditoria("CRIACAO", salvo, usuarioId);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public Page<BemCulturalResponseDTO> buscarPorProximidade(
            double latitude, double longitude, double raioMetros, Pageable pageable) {
        if (raioMetros <= 0) {
            throw new RegraNegocioRunTime("O raio de busca deve ser maior que zero.");
        }
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point ponto = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        return bemCulturalRepository.buscarPorProximidade(ponto, raioMetros, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<BemCulturalPublicoDTO> listarPublicos(String busca, Pageable pageable) {
        return listarPublicos(null, busca, pageable);
    }

    @Transactional(readOnly = true)
    public Page<BemCulturalPublicoDTO> listarPublicos(NaturezaBem natureza, String busca, Pageable pageable) {
        Page<BemCultural> bens;
        if (natureza != null) {
            bens = bemCulturalRepository.findByNaturezaAndStatusIn(natureza, STATUS_PUBLICOS, pageable);
        } else if (busca == null || busca.isBlank()) {
            bens = bemCulturalRepository.findByStatusIn(STATUS_PUBLICOS, pageable);
        } else {
            bens = bemCulturalRepository.findByStatusInAndNomeContainingIgnoreCase(
                    STATUS_PUBLICOS, busca.trim(), pageable);
        }
        return bens.map(this::toPublicResponse);
    }

    @Transactional(readOnly = true)
    public Page<BemCulturalResponseDTO> listar(Pageable pageable) {
        return bemCulturalRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BemCulturalResponseDTO buscar(UUID id) {
        return toResponse(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public BemCulturalPublicoDTO buscarPublico(String codigoOuId) {
        Optional<BemCultural> encontrado = Optional.empty();
        if (codigoOuId != null && !codigoOuId.isBlank()) {
            String limpo = codigoOuId.trim();
            try {
                UUID uuid = UUID.fromString(limpo);
                encontrado = bemCulturalRepository.findById(uuid)
                        .filter(b -> STATUS_PUBLICOS.contains(b.getStatus()));
            } catch (IllegalArgumentException ignored) {
                // Não é UUID, tenta buscar pelo código institucional
            }
            if (encontrado.isEmpty()) {
                encontrado = bemCulturalRepository.findByCodigoAndStatusIn(limpo, STATUS_PUBLICOS);
            }
        }
        return encontrado
                .map(this::toPublicResponse)
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural público não encontrado."));
    }

    @Transactional(readOnly = true)
    public GeoJsonDTO.FeatureCollection mapaPublico(String busca, Pageable pageable) {
        List<GeoJsonDTO.Feature> features = listarPublicos(busca, pageable).getContent().stream()
                .filter(bem -> bem.getLatitude() != null && bem.getLongitude() != null)
                .map(bem -> new GeoJsonDTO.Feature(
                        "Feature",
                        bem.getId().toString(),
                        new GeoJsonDTO.Geometry("Point",
                                List.of(bem.getLongitude(), bem.getLatitude())),
                        Map.of("codigo", bem.getCodigo(),
                                "nome", bem.getNome(),
                                "natureza", bem.getNatureza().name(),
                                "municipio", bem.getMunicipioNome() == null ? "" : bem.getMunicipioNome())))
                .toList();
        return new GeoJsonDTO.FeatureCollection("FeatureCollection", features);
    }

    @Transactional
    public BemCulturalResponseDTO publicar(UUID id, UUID usuarioId) {
        BemCultural bem = buscarPorId(id);
        bem.publicar();
        BemCultural salvo = bemCulturalRepository.save(bem);
        publicarAuditoria("PUBLICACAO", salvo, usuarioId);
        return toResponse(salvo);
    }

    @Transactional
    public BemCulturalResponseDTO arquivar(UUID id, UUID usuarioId) {
        BemCultural bem = buscarPorId(id);
        bem.arquivar();
        BemCultural salvo = bemCulturalRepository.save(bem);
        publicarAuditoria("ARQUIVAMENTO", salvo, usuarioId);
        return toResponse(salvo);
    }

    private void persistirLocalizacao(BemCulturalRequestDTO dto, BemCultural bem) {
        if (localizacaoBemRepository == null || dto.getLatitude() == null || dto.getLongitude() == null) {
            return;
        }
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point ponto = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
        LocalizacaoBem localizacao = LocalizacaoBem.builder()
                .bem(bem)
                .geom(ponto)
                .epsg(4326)
                .datum("SIRGAS2000")
                .principal(true)
                .tipoLocalizacao("PRINCIPAL")
                .logradouro(dto.getLogradouro())
                .numero(dto.getNumero())
                .bairro(dto.getBairro())
                .build();
            localizacaoBemRepository.save(Objects.requireNonNull(localizacao, "localizacao"));
    }

    private void publicarAuditoria(String acao, BemCultural bem, UUID usuarioId) {
        if (eventPublisher == null) {
            return;
        }
        AuditoriaEvent evento = AuditoriaEvent.builder()
                .entidade("BEM_CULTURAL")
                .entidadeId(bem.getId())
                .acao(acao)
                .usuarioId(usuarioId)
                .dadosNovos(Map.of("codigo", String.valueOf(bem.getCodigo()), "status", bem.getStatus()))
                .origem("BEM_CULTURAL_SERVICE")
                .build();
            eventPublisher.publishEvent(Objects.requireNonNull(evento, "evento"));
    }

    private BemCultural buscarPorId(UUID id) {
        return bemCulturalRepository.findById(Objects.requireNonNull(id, "id"))
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));
    }

    private BemCulturalResponseDTO toResponse(BemCultural bem) {
        return BemCulturalResponseDTO.builder()
                .id(bem.getId())
                .codigo(bem.getCodigo())
                .natureza(bem.getNatureza())
                .nome(bem.getNome())
                .resumoPublico(bem.getResumoPublico())
                .descricao(bem.getDescricao())
                .status(StatusBemCultural.valueOf(bem.getStatus()))
                .dadosEspecificos(bem.getDadosEspecificos())
                .criadoEm(bem.getCriadoEm())
                .build();
    }

    private BemCulturalPublicoDTO toPublicResponse(BemCultural bem) {
        BemCulturalPublicoDTO.BemCulturalPublicoDTOBuilder builder = BemCulturalPublicoDTO.builder()
                .id(bem.getId())
                .codigo(bem.getCodigo())
                .natureza(bem.getNatureza())
                .nome(bem.getNome())
                .resumoPublico(bem.getResumoPublico())
                .descricao(bem.getDescricao())
                .status(StatusBemCultural.valueOf(bem.getStatus()));

        if (localizacaoBemRepository != null) {
            localizacaoBemRepository.findFirstByBemIdAndPrincipalTrue(bem.getId()).ifPresent(localizacao -> {
                Geometry geometry = localizacao.getGeom();
                if (geometry != null) {
                    Geometry point = geometry.getCentroid();
                    double latitude = point.getCoordinate().y;
                    double longitude = point.getCoordinate().x;
                    if (NaturezaBem.ARQUEOLOGICO.name().equals(bem.getNatureza().name())) {
                        latitude = generalizarCoordenada(latitude);
                        longitude = generalizarCoordenada(longitude);
                    }
                    builder.latitude(latitude).longitude(longitude);
                }
                if (localizacao.getMunicipio() != null) {
                    builder.municipioNome(localizacao.getMunicipio().getNome());
                }
            });
        }
        return builder.build();
    }

    private double generalizarCoordenada(double coordenada) {
        return Math.round(coordenada * 100.0) / 100.0;
    }

    private void validarRegrasEspecificas(BemCulturalDTO dto) {
        if (dto.getDadosEspecificos() == null) {
            throw new RegraNegocioRunTime("Os dados específicos do patrimônio não podem ser nulos.");
        }
        // As validações finas por anotação (@NotBlank, @Min) ocorrem via Jackson no Controller (@Valid)
    }
}
