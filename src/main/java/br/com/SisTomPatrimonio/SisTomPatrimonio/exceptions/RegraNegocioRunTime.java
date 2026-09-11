package br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions;

/**
 * Exceção de tempo de execução personalizada para padronizar o tratamento de erros de regras de negócio.
 */
public class RegraNegocioRunTime extends RuntimeException {

    public RegraNegocioRunTime(String mensagem) {
        super(mensagem);
    }

    public RegraNegocioRunTime(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
