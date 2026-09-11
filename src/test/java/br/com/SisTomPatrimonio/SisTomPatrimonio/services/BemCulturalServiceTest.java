package br.com.SisTomPatrimonio.SisTomPatrimonio.services;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalRequestDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.LocalizacaoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BemCulturalServiceTest {

    @Mock
    private BemCulturalRepository bemRepository;

    @Mock
    private LocalizacaoBemRepository localizacaoRepository;

    @Mock
    private OrganizacaoRepository organizacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private BemCulturalService bemCulturalService;

    private UUID orgId;
    private UUID usuarioId;
    private Organizacao organizacao;
    private Usuario usuario;

    @BeforeEach
    void setup() {
        orgId = UUID.randomUUID();
        usuarioId = UUID.randomUUID();

        organizacao = Organizacao.builder().id(orgId).nome("IPHAN").build();
        usuario = Usuario.builder().id(usuarioId).nome("Analista").perfil(PerfilUsuario.TECNICO).build();
    }

    @Test
    @DisplayName("Deve cadastrar novo bem cultural com sucesso sem coordenadas")
    void deveCadastrarBemSemGeolocalizacao() {
        BemCulturalRequestDTO dto = new BemCulturalRequestDTO();
        dto.setCodigo("BEM-100");
        dto.setNome("Casarão Histórico");
        dto.setNatureza(NaturezaBem.MATERIAL_EDIFICADO);
        dto.setOrganizacaoResponsavelId(orgId);

        when(organizacaoRepository.findById(orgId)).thenReturn(Optional.of(organizacao));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(bemRepository.save(any(BemCultural.class))).thenAnswer(invocation -> {
            BemCultural bem = invocation.getArgument(0);
            bem.setId(UUID.randomUUID());
            return bem;
        });

        BemCulturalResponseDTO response = bemCulturalService.cadastrarBem(dto, usuarioId);

        assertThat(response).isNotNull();
        assertThat(response.getCodigo()).isEqualTo("BEM-100");
        assertThat(response.getNome()).isEqualTo("Casarão Histórico");
        verify(bemRepository, times(1)).save(any(BemCultural.class));
        verify(localizacaoRepository, never()).save(any());
    }
}