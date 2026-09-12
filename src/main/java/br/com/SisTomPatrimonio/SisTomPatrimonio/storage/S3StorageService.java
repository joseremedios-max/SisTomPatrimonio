package br.com.SisTomPatrimonio.SisTomPatrimonio.storage;

import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

/**
 * Implementação de StorageService para nuvem (AWS S3 / MinIO).
 * Habilitada via propriedade 'sipma.storage.type=s3'.
 * Demonstra o Princípio Aberto/Fechado (OCP) e Baixo Acoplamento: o DocumentoService
 * não sabe se o arquivo está na nuvem ou no disco local.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "sipma.storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    @Override
    public String armazenar(String nomeArquivoOriginal, byte[] conteudo, String mimeType) {
        log.info("Enviando arquivo para bucket S3: nome={} mimeType={}", nomeArquivoOriginal, mimeType);
        String storageKey = "s3://" + UUID.randomUUID() + "/" + nomeArquivoOriginal;
        // Integração com AWS S3 SDK (ex: s3Client.putObject(...))
        return storageKey;
    }

    @Override
    public byte[] carregar(String storageKey) {
        log.info("Buscando arquivo no bucket S3: chave={}", storageKey);
        // Integração com AWS S3 SDK (ex: s3Client.getObject(...))
        throw new UnsupportedOperationException("Integração AWS S3 em modo demonstrativo.");
    }

    @Override
    public void remover(String storageKey) {
        log.info("Removendo objeto no bucket S3: chave={}", storageKey);
        // Integração com AWS S3 SDK (ex: s3Client.deleteObject(...))
    }

    @Override
    public String calcularSha256(byte[] conteudo) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(conteudo);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 indisponível.", e);
        }
    }
}
