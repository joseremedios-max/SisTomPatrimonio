import { describe, expect, it } from 'vitest';
import { ClassificacaoSeguranca, NaturezaBem } from '../types/dtos';
import {
  carregarRascunhoWizard,
  enfileirarLaudoOffline,
  limparRascunhoWizard,
  listarLaudosOfflinePendentes,
  removerLaudoOffline,
  salvarRascunhoWizard,
} from './offlineDb';

describe('persistência offline (IndexedDB / Fallback)', () => {
  it('salva, carrega e limpa rascunho do Wizard em 10 etapas', async () => {
    await salvarRascunhoWizard({
      etapa: 4,
      codigo: 'SIPMA-2026-001',
      nome: 'Sobrado Azulejado da Rua Grande',
      natureza: NaturezaBem.MATERIAL_EDIFICADO,
      classificacao: ClassificacaoSeguranca.PUBLICA,
      organizacaoResponsavelId: '11111111-1111-1111-1111-111111111111',
      resumoPublico: 'Sobrado colonial do século XIX',
      descricao: 'Fachada revestida de azulejos portugueses',
      dados: { tipologiaArquitetonica: 'Colonial Civil' },
    });

    const carregado = await carregarRascunhoWizard();
    expect(carregado).not.toBeNull();
    expect(carregado?.etapa).toBe(4);
    expect(carregado?.codigo).toBe('SIPMA-2026-001');

    await limparRascunhoWizard();
    const aposLimpar = await carregarRascunhoWizard();
    expect(aposLimpar).toBeNull();
  });

  it('enfileira e remove laudos de vistoria offline para sincronização PWA', async () => {
    const laudo = await enfileirarLaudoOffline({
      vistoriaId: 'vist-001',
      patologias: [{ tipo: 'Fissura', severidade: 'ALTA', descricao: 'Trinca diagonal' }],
      resumo: 'Inspeção em campo sem sinal de internet',
      recomendacao: 'Escoramento imediato',
    });

    const pendentes = await listarLaudosOfflinePendentes();
    expect(pendentes.some((item) => item.id === laudo.id)).toBe(true);

    await removerLaudoOffline(laudo.id);
    const aposRemover = await listarLaudosOfflinePendentes();
    expect(aposRemover.some((item) => item.id === laudo.id)).toBe(false);
  });
});

