package br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MissingRequestHeaderException;

import java.net.URI;
import java.time.OffsetDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegraNegocioRunTime.class)
    public ProblemDetail handleRegraNegocio(RegraNegocioRunTime ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        problemDetail.setTitle("Violação de Regra de Negócio");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/regra-de-negocio"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ProblemDetail handleRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problemDetail.setTitle("Recurso Não Encontrado");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/recurso-nao-encontrado"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidacao(MethodArgumentNotValidException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Um ou mais campos contêm erros de validação.");
        problemDetail.setTitle("Erro de Validação de Dados");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/dados-invalidos"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());

        var errosCampos = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(java.util.stream.Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Inválido"
                ));

        problemDetail.setProperty("erros", errosCampos);
        return problemDetail;
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ProblemDetail handleHeaderAusente(MissingRequestHeaderException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "O header '" + ex.getHeaderName() + "' é obrigatório.");
        problemDetail.setTitle("Header Obrigatório Ausente");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/header-ausente"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleArgumentoInvalido(MethodArgumentTypeMismatchException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "O valor informado para '" + ex.getName() + "' é inválido.");
        problemDetail.setTitle("Parâmetro Inválido");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/parametro-invalido"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "Conflito de integridade nos dados persistidos.");
        problemDetail.setTitle("Violação de Integridade de Banco de Dados");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/integridade-dados"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneralException(Exception ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno inesperado no servidor.");
        problemDetail.setTitle("Erro Interno do Servidor");
        problemDetail.setType(URI.create("https://sipma.gov.br/erros/erro-interno"));
        problemDetail.setProperty("timestamp", OffsetDateTime.now());
        return problemDetail;
    }
}