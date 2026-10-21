import { describe, expect, it } from 'vitest';
import { formatarData, formatarMoeda } from './formatters';

describe('formatadores da aplicação', () => {
  it('formata datas no padrão brasileiro', () => {
    expect(formatarData('2026-01-15T12:00:00Z')).toMatch(/15\/01\/2026/);
  });

  it('formata valores em reais', () => {
    expect(formatarMoeda(1234.5)).toContain('1.234,50');
    expect(formatarMoeda(1234.5)).toContain('R$');
  });
});
