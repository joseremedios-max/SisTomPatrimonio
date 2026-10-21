package br.com.SisTomPatrimonio.SisTomPatrimonio.storage;

public interface StorageService {

    /**
     * Armazena o arquivo e retorna a chave única de armazenamento (storageKey).
     */
    String armazenar(String nomeArquivoOriginal, byte[] conteudo, String mimeType);

    /**
     * Recupera o conteúdo binário a partir da chave de armazenamento.
     */
    byte[] carregar(String storageKey);

    /**
     * Remove o arquivo físico correspondente à chave informada.
     */
    void remover(String storageKey);

    /**
     * Calcula o hash SHA-256 dos bytes do arquivo para garantia de integridade.
     */
    String calcularSha256(byte[] conteudo);
}
