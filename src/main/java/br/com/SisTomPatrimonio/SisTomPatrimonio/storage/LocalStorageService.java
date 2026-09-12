package br.com.SisTomPatrimonio.SisTomPatrimonio.storage;

import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "sipma.storage.type", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final Path rootLocation;

    public LocalStorageService(@Value("${sipma.storage.local-dir:./storage/uploads}") String localDir) {
        this.rootLocation = Paths.get(localDir);
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            log.error("Não foi possível inicializar diretório de armazenamento: {}", e.getMessage());
        }
    }

    @Override
    public String armazenar(String nomeArquivoOriginal, byte[] conteudo, String mimeType) {
        if (conteudo == null || conteudo.length == 0) {
            throw new RegraNegocioRunTime("O conteúdo do arquivo não pode ser vazio.");
        }

        String extensao = extrairExtensao(nomeArquivoOriginal);
        String storageKey = UUID.randomUUID() + (extensao.isEmpty() ? "" : "." + extensao);
        Path destino = this.rootLocation.resolve(storageKey);

        try {
            Files.write(destino, conteudo);
            log.info("Arquivo armazenado localmente com chave: {}", storageKey);
            return storageKey;
        } catch (IOException e) {
            log.error("Erro ao salvar arquivo em disco: {}", e.getMessage(), e);
            throw new RegraNegocioRunTime("Falha ao persistir arquivo no sistema de arquivos.");
        }
    }

    @Override
    public byte[] carregar(String storageKey) {
        try {
            Path arquivo = this.rootLocation.resolve(storageKey).normalize();
            if (!Files.exists(arquivo)) {
                throw new RegraNegocioRunTime("Arquivo não encontrado no armazenamento.");
            }
            return Files.readAllBytes(arquivo);
        } catch (IOException e) {
            throw new RegraNegocioRunTime("Erro ao ler arquivo do armazenamento.");
        }
    }

    @Override
    public void remover(String storageKey) {
        try {
            Path arquivo = this.rootLocation.resolve(storageKey).normalize();
            Files.deleteIfExists(arquivo);
            log.info("Arquivo removido: {}", storageKey);
        } catch (IOException e) {
            log.warn("Falha ao remover arquivo: {}", storageKey);
        }
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
            throw new IllegalStateException("Algoritmo SHA-256 não disponível no ambiente.", e);
        }
    }

    private String extrairExtensao(String nomeArquivo) {
        if (nomeArquivo == null || !nomeArquivo.contains(".")) {
            return "";
        }
        return nomeArquivo.substring(nomeArquivo.lastIndexOf(".") + 1).replaceAll("[^a-zA-Z0-9]", "");
    }
}
