# 05 - Componente de Upload, Integridade SHA-256 e Antivírus ClamAV

## 📤 Componente `FileUploadZone.tsx`

O upload de mídias no **SIP-MA** atende a rigorosos critérios de integridade e descarregamento do banco de dados (Zero Bytea):

```tsx
// Fluxo do cálculo do Hash SHA-256 no cliente antes do envio
const calcularHashSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

---

## 🛡️ Regras de Validação e Varredura Antivírus Assíncrona (ClamAV):
1. **Limitação de Tamanho:** Máximo de 50 MB por arquivo.
2. **Extensões Permitidas:** `.pdf`, `.png`, `.jpg`, `.jpeg`, `.dwg`.
3. **Integridade de Armazenamento (SHA-256):** O frontend calcula o hash SHA-256 e envia na requisição. O backend (`DocumentoService`) reconfere o hash antes de salvar o arquivo no *Storage S3/Local*, registrando o caminho físico no banco sem armazenar dados binários na tabela.
4. **Varredura Antivírus Assíncrona (`AntivirusScannerService`):**
   - Após o recebimento do arquivo, o serviço executa `@Async escanearDocumentoAssincrono(documentoId, conteudo)` via protocolo TCP `zINSTREAM` do daemon **ClamAV** (`security.clamav.host` / `security.clamav.port`) combinado com detecção determinística de assinaturas maliciosas/EICAR.
   - Arquivos aprovados recebem `statusValidacao = VALIDADO` e `metadados.antivirusStatus = CLEAN`.
   - Arquivos infectados são marcados imediatamente com `statusValidacao = REJEITADO`, `publicacaoAutorizada = false`, `metadados.antivirusStatus = INFECTED`, e têm o download bloqueado no endpoint `GET /api/v1/documentos/{id}/download`.
