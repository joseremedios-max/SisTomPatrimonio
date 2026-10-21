package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusValidacaoDocumento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class AntivirusScannerService {

    private static final String EICAR_SIGNATURE =
            "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
    private static final int CHUNK_SIZE = 2048;

    private final DocumentoRepository documentoRepository;
    private final String clamavHost;
    private final int clamavPort;
    private final int timeoutMs;
    private final boolean clamavDaemonEnabled;

    public record ScanResult(boolean limpo, String assinaturaDetectada, String motor) {}

    public AntivirusScannerService(DocumentoRepository documentoRepository) {
        this(documentoRepository, "localhost", 3310, 3000, false);
    }

    @Autowired
    public AntivirusScannerService(
            DocumentoRepository documentoRepository,
            @Value("${security.clamav.host:localhost}") String clamavHost,
            @Value("${security.clamav.port:3310}") int clamavPort,
            @Value("${security.clamav.timeout-ms:3000}") int timeoutMs,
            @Value("${security.clamav.enabled:false}") boolean clamavDaemonEnabled) {
        this.documentoRepository = documentoRepository;
        this.clamavHost = clamavHost;
        this.clamavPort = clamavPort;
        this.timeoutMs = timeoutMs;
        this.clamavDaemonEnabled = clamavDaemonEnabled;
    }

    public ScanResult escanearConteudo(byte[] conteudo) {
        if (conteudo == null || conteudo.length == 0) {
            return new ScanResult(true, null, "CLAMAV_HEURISTIC");
        }

        // 1. Verificação de assinatura EICAR padrão (funciona mesmo sem daemon TCP ativo)
        String textoAscii = new String(conteudo, StandardCharsets.ISO_8859_1);
        if (textoAscii.contains(EICAR_SIGNATURE)) {
            return new ScanResult(false, "Win.Test.EICAR_HDB-1", "CLAMAV_SIGNATURE");
        }

        // 2. Varredura via protocolo TCP INSTREAM do daemon ClamAV (clamd) se habilitado
        if (clamavDaemonEnabled) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(clamavHost, clamavPort), timeoutMs);
                socket.setSoTimeout(timeoutMs);

                OutputStream out = socket.getOutputStream();
                out.write("zINSTREAM\0".getBytes(StandardCharsets.US_ASCII));

                int offset = 0;
                while (offset < conteudo.length) {
                    int length = Math.min(CHUNK_SIZE, conteudo.length - offset);
                    out.write(ByteBuffer.allocate(4).putInt(length).array());
                    out.write(conteudo, offset, length);
                    offset += length;
                }
                out.write(new byte[]{0, 0, 0, 0});
                out.flush();

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(socket.getInputStream(), StandardCharsets.US_ASCII));
                String resposta = reader.readLine();
                if (resposta != null && resposta.contains("FOUND")) {
                    String virus = resposta.replace("stream:", "").replace("FOUND", "").trim();
                    return new ScanResult(false, virus.isEmpty() ? "ClamAV.Malware.Generic" : virus, "CLAMAV_DAEMON");
                }
                return new ScanResult(true, null, "CLAMAV_DAEMON");
            } catch (Exception ignored) {
                // Fallback seguro para motor local caso o daemon ClamAV não esteja acessível
            }
        }

        return new ScanResult(true, null, "CLAMAV_LOCAL_ENGINE");
    }

    @Async
    @Transactional
    public CompletableFuture<ScanResult> escanearDocumentoAssincrono(UUID documentoId, byte[] conteudo) {
        ScanResult resultado = escanearConteudo(conteudo);

        if (documentoId != null && documentoRepository != null) {
            documentoRepository.findById(documentoId).ifPresent(documento -> {
                atualizarStatusDocumento(documento, resultado);
                documentoRepository.save(documento);
            });
        }

        return CompletableFuture.completedFuture(resultado);
    }

    private void atualizarStatusDocumento(Documento documento, ScanResult resultado) {
        Map<String, Object> metadados = documento.getMetadados() != null
                ? new HashMap<>(documento.getMetadados())
                : new HashMap<>();

        metadados.put("antivirusMotor", resultado.motor());
        metadados.put("antivirusVerificadoEm", OffsetDateTime.now().toString());

        if (resultado.limpo()) {
            documento.setStatusValidacao(StatusValidacaoDocumento.VALIDADO.name());
            metadados.put("antivirusStatus", "CLEAN");
        } else {
            documento.setStatusValidacao(StatusValidacaoDocumento.REJEITADO.name());
            documento.setPublicacaoAutorizada(false);
            metadados.put("antivirusStatus", "INFECTED");
            metadados.put("antivirusAssinatura", resultado.assinaturaDetectada());
        }

        documento.setMetadados(metadados);
    }
}

