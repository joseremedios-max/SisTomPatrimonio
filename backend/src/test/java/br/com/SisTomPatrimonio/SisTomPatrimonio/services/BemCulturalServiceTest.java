package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DadosMaterialEdificadoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.LocalizacaoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BemCulturalServiceTest {

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private LocalizacaoBemRepository localizacaoBemRepository;

    @Mock
    private OrganizacaoRepository organizacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private BemCulturalService bemCulturalService;

    @Test
    @DisplayName("Deve salvar Bem Cultural Material Edificado convertendo o DTO específico em Map JSONB")
    void deveCriarBemCulturalComSucesso() {
        DadosMaterialEdificadoDTO dadosEdificado = new DadosMaterialEdificadoDTO();
        dadosEdificado.setTipoImovel("Casarão Histórico");
        dadosEdificado.setAreaConstruidaM2(450.0);
        dadosEdificado.setDominioAtual("PUBLICO");

        BemCulturalDTO dto = new BemCulturalDTO();
        dto.setNome("Palácio dos Leões");
        dto.setNatureza(NaturezaBem.MATERIAL_EDIFICADO);
        dto.setClassificacao("PUBLICA");
        dto.setDadosEspecificos(dadosEdificado);

        when(bemCulturalRepository.save(any(BemCultural.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BemCultural resultado = bemCulturalService.criar(dto);

        assertNotNull(resultado);
        assertEquals("Palácio dos Leões", resultado.getNome());
        assertEquals(NaturezaBem.MATERIAL_EDIFICADO, resultado.getNatureza());
        assertNotNull(resultado.getDadosEspecificos());
        assertEquals("Casarão Histórico", resultado.getDadosEspecificos().get("tipoImovel"));
        
        verify(bemCulturalRepository, times(1)).save(any(BemCultural.class));
        verify(eventPublisher, times(1)).publishEvent(any(AuditoriaEvent.class));
    }

    @Test
    @DisplayName("Deve lançar RegraNegocioRunTime quando dados específicos forem nulos")
    void deveLancarExcecaoQuandoDadosEspecificosForemNulos() {
        BemCulturalDTO dto = new BemCulturalDTO();
        dto.setNome("Festa do Bumba Meu Boi");
        dto.setNatureza(NaturezaBem.IMATERIAL);
        dto.setDadosEspecificos(null);

        assertThrows(RegraNegocioRunTime.class, () -> bemCulturalService.criar(dto));
        verify(bemCulturalRepository, never()).save(any());
    }
}