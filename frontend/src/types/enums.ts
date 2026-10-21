export const NaturezaBem = {
  MATERIAL_EDIFICADO: 'MATERIAL_EDIFICADO',
  IMATERIAL: 'IMATERIAL',
  ARQUEOLOGICO: 'ARQUEOLOGICO',
} as const;
export type NaturezaBem = typeof NaturezaBem[keyof typeof NaturezaBem];

export const ClassificacaoSeguranca = {
  PUBLICA: 'PUBLICA',
  INTERNA: 'INTERNA',
  RESTRITA: 'RESTRITA',
  SIGILOSA: 'SIGILOSA',
} as const;
export type ClassificacaoSeguranca = typeof ClassificacaoSeguranca[keyof typeof ClassificacaoSeguranca];

export const StatusBemCultural = {
  RASCUNHO: 'RASCUNHO',
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
} as const;
export type StatusBemCultural = typeof StatusBemCultural[keyof typeof StatusBemCultural];

export type StatusVistoria = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';