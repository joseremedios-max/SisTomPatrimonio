package br.com.SisTomPatrimonio.SisTomPatrimonio.config;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.LocalizacaoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Municipio;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.LocalizacaoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.MunicipioRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Component
@Profile("dev")
@Order(2)
public class DevPatrimonyDataInitializer implements CommandLineRunner {

    private final BemCulturalRepository bemRepository;
    private final LocalizacaoBemRepository localizacaoRepository;
    private final MunicipioRepository municipioRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public DevPatrimonyDataInitializer(
            BemCulturalRepository bemRepository,
            LocalizacaoBemRepository localizacaoRepository,
            MunicipioRepository municipioRepository,
            OrganizacaoRepository organizacaoRepository,
            UsuarioRepository usuarioRepository) {
        this.bemRepository = bemRepository;
        this.localizacaoRepository = localizacaoRepository;
        this.municipioRepository = municipioRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Municipio saoLuis = municipioRepository.findByCodigoIbge("2111300")
                .orElseGet(() -> municipioRepository.save(Municipio.builder()
                        .codigoIbge("2111300")
                        .nome("São Luís")
                        .uf("MA")
                        .build()));
        Municipio alcantara = municipioRepository.findByCodigoIbge("2100204")
                .orElseGet(() -> municipioRepository.save(Municipio.builder()
                        .codigoIbge("2100204")
                        .nome("Alcântara")
                        .uf("MA")
                        .build()));
        Organizacao organizacao = organizacaoRepository.findByCnpj("00000000000191")
                .orElseGet(() -> organizacaoRepository.save(Organizacao.builder()
                        .nome("Secretaria de Estado da Cultura do Maranhão")
                        .sigla("SECMA")
                        .tipo("ORGAO_PUBLICO")
                        .esfera("ESTADUAL")
                        .cnpj("00000000000191")
                        .email("dev@secma.ma.gov.br")
                        .build()));
        var usuario = usuarioRepository.findByEmail("admin@local.test").orElseThrow();

        criarBem("DEV-MAT-001", NaturezaBem.MATERIAL_EDIFICADO,
                "Centro Histórico de São Luís",
                "Conjunto arquitetônico colonial português com azulejaria histórica na Praia Grande e Desterro.",
                "PUBLICADO", saoLuis, organizacao, usuario, -2.53073, -44.30680, "BAIXO");
        criarBem("DEV-MAT-002", NaturezaBem.MATERIAL_EDIFICADO,
                "Conjunto Arquitetônico e Urbanístico de Alcântara",
                "Cidade-monumento colonial do século XVII com ruínas históricas, pelourinho e sobrados seculares.",
                "PUBLICADO", alcantara, organizacao, usuario, -2.40833, -44.41472, "MEDIO");
        criarBem("DEV-IMA-001", NaturezaBem.IMATERIAL,
                "Tambor de Crioula do Maranhão",
                "Forma de expressão de matriz afro-brasileira que envolve dança circular, canto e percussão de tambores.",
                "PUBLICADO", saoLuis, organizacao, usuario, -2.52990, -44.28290, "MEDIO");
        criarBem("DEV-IMA-002", NaturezaBem.IMATERIAL,
                "Complexo Cultural do Bumba-meu-boi do Maranhão",
                "Celebração popular maranhense em diversos sotaques (Matraca, Zabumba, Orquestra, Baixada e Costa de Mão).",
                "PUBLICADO", saoLuis, organizacao, usuario, -2.54110, -44.29540, "BAIXO");
        criarBem("DEV-ARQ-001", NaturezaBem.ARQUEOLOGICO,
                "Sítio Arqueológico Sambaqui do Bacanga",
                "Sítio arqueológico pré-colonial estuarino com vestígios malacológicos e cerâmicos (coordenadas públicas generalizadas).",
                "PUBLICADO", saoLuis, organizacao, usuario, -2.56241, -44.25387, "ALTO");
    }

    private void criarBem(
            String codigo,
            NaturezaBem natureza,
            String nome,
            String resumo,
            String status,
            Municipio municipio,
            Organizacao organizacao,
            br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario usuario,
            double latitude,
            double longitude,
            String risco) {
        BemCultural bem = bemRepository.findByCodigo(codigo).orElseGet(() -> bemRepository.save(BemCultural.builder()
                .codigo(codigo)
                .natureza(natureza.name())
                .nome(nome)
                .resumoPublico(resumo)
                .descricao(resumo)
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .classificacao("PUBLICA")
                .status(status)
                .dadosEspecificos(Map.of("nivelRisco", risco, "origem", "SEED_DEV"))
                .build()));

        if ("EM_REVISAO".equals(bem.getStatus()) || "RASCUNHO".equals(bem.getStatus())) {
            bem.setStatus("PUBLICADO");
            bemRepository.save(bem);
        }

        if (localizacaoRepository.findFirstByBemIdAndPrincipalTrue(bem.getId()).isEmpty()) {
            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
            Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
            localizacaoRepository.save(LocalizacaoBem.builder()
                    .bem(bem)
                    .municipio(municipio)
                    .geom(point)
                    .precisaoM(BigDecimal.valueOf(10))
                    .metodoColeta("SEED_DEV")
                    .datum("WGS84")
                    .epsg(4326)
                    .tipoLocalizacao("PRINCIPAL")
                    .principal(true)
                    .fonte("SisTomPatrimonio dev")
                    .build());
        }
    }
}
