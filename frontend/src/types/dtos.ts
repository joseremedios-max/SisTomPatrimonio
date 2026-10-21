// src/types/dtos.ts
// Tipagem estática rigorosa espelhada nos DTOs da API RESTful Spring Boot do SIP-MA

export const NaturezaBem = {
  MATERIAL_EDIFICADO: 'MATERIAL_EDIFICADO',
  IMATERIAL: 'IMATERIAL',
  ARQUEOLOGICO: 'ARQUEOLOGICO'
} as const;
export type NaturezaBem = typeof NaturezaBem[keyof typeof NaturezaBem];

export const ClassificacaoSeguranca = {
  PUBLICA: 'PUBLICA',
  INTERNA: 'INTERNA',
  RESTRITA: 'RESTRITA',
  SIGILOSA: 'SIGILOSA'
} as const;
export type ClassificacaoSeguranca = typeof ClassificacaoSeguranca[keyof typeof ClassificacaoSeguranca];

export const StatusBemCultural = {
  RASCUNHO: 'RASCUNHO',
  EM_REVISAO: 'EM_REVISAO',
  APROVADO: 'APROVADO',
  PUBLICADO: 'PUBLICADO',
  ARQUIVADO: 'ARQUIVADO'
} as const;
export type StatusBemCultural = typeof StatusBemCultural[keyof typeof StatusBemCultural];

export const PerfilUsuario = {
  ADMIN: 'ADMIN',
  TECNICO: 'TECNICO',
  CONSULTOR: 'CONSULTOR',
  LEITOR: 'LEITOR',
  JURIDICO: 'JURIDICO'
} as const;
export type PerfilUsuario = typeof PerfilUsuario[keyof typeof PerfilUsuario];

export const StatusVistoria = {
  PLANEJADA: 'PLANEJADA',
  PENDENTE: 'PENDENTE',
  EM_CAMPO: 'EM_CAMPO',
  EM_ANALISE: 'EM_ANALISE',
  REALIZADA: 'REALIZADA',
  CANCELADA: 'CANCELADA'
} as const;
export type StatusVistoria = typeof StatusVistoria[keyof typeof StatusVistoria];

export const StatusValidacaoDocumento = {
  PENDENTE: 'PENDENTE',
  VALIDADO: 'VALIDADO',
  REJEITADO: 'REJEITADO'
} as const;
export type StatusValidacaoDocumento = typeof StatusValidacaoDocumento[keyof typeof StatusValidacaoDocumento];

export interface UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  organizacaoId?: string;
  perfil: PerfilUsuario;
  registroProfissional?: string;
  ativo: boolean;
  doisFatores: boolean;
}

export interface LoginResponseDTO extends UsuarioDTO {
  token?: string;
  expiresIn?: number;
}

export interface PageDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Interfaces de Metadados Específicos para JSONB
export interface DadosMaterialEdificado {
  tipoImovel?: string;
  tipologiaArquitetonica?: string;
  usoOriginal?: string;
  usoAtual?: string;
  dominioAtual?: string;
  anoInicio?: number;
  anoFim?: number;
  areaConstruidaM2?: number;
  areaTerrenoM2?: number;
  numeroPavimentos?: number;
  estrutura?: string;
  cobertura?: string;
}

export interface DadosImaterial {
  categoriaImaterial?: string;
  periodicidade?: string;
  contextoPratica?: string;
  riscosContinuidade?: string;
}

export interface DadosArqueologico {
  tipoSitio?: string;
  periodoCultural?: string;
  regimeAcesso?: string;
  restrito?: boolean;
  geomExataConfidencial?: string;
}

export type DadosEspecificosJSONB = 
  | DadosMaterialEdificado 
  | DadosImaterial 
  | DadosArqueologico 
  | Record<string, unknown>;

export interface BemCulturalDTO {
  id?: string;
  codigo: string;
  natureza: NaturezaBem;
  nome: string;
  resumoPublico?: string;
  descricao?: string;
  observacoesInternas?: string;
  classificacao: ClassificacaoSeguranca;
  status?: StatusBemCultural;
  organizacaoResponsavelId?: string;
  
  // Metadados dinâmicos semiestruturados (JSONB)
  dadosEspecificos?: DadosEspecificosJSONB;

  // Auditoria
  criadoPor?: string;
  criadoEm?: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
  publicadoEm?: string;
}

export interface VistoriaDTO {
  id?: string;
  codigo: string;
  bemId: string;
  status: StatusVistoria;
  agendadaEm?: string;
  realizadaEm?: string;
  responsavelId?: string;
  organizacaoId?: string;
  equipe?: Record<string, unknown>;
  situacaoConservacao?: string;
  nivelRisco?: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  patologias?: Record<string, unknown>;
  resumo?: string;
  recomendacao?: string;
  proximaVistoria?: string;
  homologada?: boolean;
}

export interface DocumentoDTO {
  id?: string;
  codigo?: string;
  titulo: string;
  categoria?: string;
  classificacao: ClassificacaoSeguranca;
  statusValidacao: StatusValidacaoDocumento;
  bemId?: string;
  vistoriaId?: string;
  nomeArquivo: string;
  mimeType?: string;
  tamanhoBytes?: number;
  storageKey?: string;
  sha256?: string;
  versao?: number;
  publicacaoAutorizada?: boolean;
}

export interface EventoBemDTO {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  dataInicio?: string;
  anoInicio?: number;
  custo?: number;
}

export interface ProcessoJudicialDTO {
  id?: string;
  numeroProcesso: string;
  tribunal: string;
  varaComarca?: string;
  fase: string;
  dataDistribuicao?: string;
  assunto?: string;
}

export interface BemCulturalPublicoDTO {
  id: string;
  codigo: string;
  natureza: NaturezaBem;
  nome: string;
  resumoPublico?: string;
  descricao?: string;
  status: StatusBemCultural;
  municipioNome?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeoJsonFeature {
  type: 'Feature';
  id: string;
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: Record<string, string>;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface MunicipioPublicoDTO {
  id: string;
  codigoIbge: string;
  nome: string;
  uf: string;
}

export interface SalvaguardaDTO {
  id: string;
  bemCulturalId: string;
  planoAcao: string;
  status: string;
  dataInicio?: string;
  dataPrevisaoFim?: string;
  dataConclusao?: string;
  responsavelId: string;
}

export interface DashboardDTO {
  totalBens: number;
  bensPublicados: number;
  bensEmRevisao: number;
  vistoriasPendentes: number;
  bensAltoRisco: number;
  processosAbertos: number;
}

export interface AlertaDTO {
  tipo: string;
  severidade: string;
  mensagem: string;
  referenciaId: string;
}

export interface ProcessoBemDTO {
  bemId: string;
  papelDoBem?: string;
  impactoConservacao?: string;
  observacao?: string;
}

export interface MovimentacaoJudicialDTO {
  id?: string;
  dataMovimentacao: string;
  descricao: string;
  observacao?: string;
}
