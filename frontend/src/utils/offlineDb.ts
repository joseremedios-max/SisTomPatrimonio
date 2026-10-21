import type { ClassificacaoSeguranca, NaturezaBem } from '../types/dtos';
import type { Patologia } from '../hooks/useVistoria';

export interface WizardDraftRecord {
  id: string;
  etapa: number;
  codigo: string;
  nome: string;
  natureza: NaturezaBem;
  classificacao: ClassificacaoSeguranca;
  organizacaoResponsavelId: string;
  resumoPublico: string;
  descricao: string;
  dados: Record<string, string | number | boolean>;
  atualizadoEm: string;
}

export interface OfflineLaudoRecord {
  id: string;
  vistoriaId: string;
  patologias: Patologia[];
  resumo: string;
  recomendacao: string;
  criadoEm: string;
}

const DB_NAME = 'sipma_offline_db';
const DB_VERSION = 1;
const STORE_WIZARD_DRAFTS = 'wizard_drafts';
const STORE_OFFLINE_LAUDOS = 'offline_laudos';
export const DEFAULT_WIZARD_DRAFT_ID = 'bem_cultural_wizard_active';

const memoryWizardFallback = new Map<string, WizardDraftRecord>();
const memoryLaudosFallback = new Map<string, OfflineLaudoRecord>();

function hasIndexedDB(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_WIZARD_DRAFTS)) {
        db.createObjectStore(STORE_WIZARD_DRAFTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OFFLINE_LAUDOS)) {
        db.createObjectStore(STORE_OFFLINE_LAUDOS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Falha ao abrir IndexedDB do SIP-MA.'));
  });
}

export async function salvarRascunhoWizard(
  draft: Omit<WizardDraftRecord, 'id' | 'atualizadoEm'>,
  id: string = DEFAULT_WIZARD_DRAFT_ID,
): Promise<WizardDraftRecord> {
  const record: WizardDraftRecord = {
    ...draft,
    id,
    atualizadoEm: new Date().toISOString(),
  };

  if (!hasIndexedDB()) {
    memoryWizardFallback.set(id, record);
    return record;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_WIZARD_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_WIZARD_DRAFTS);
      store.put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Falha ao gravar rascunho no IndexedDB.'));
      };
    });
  } catch {
    memoryWizardFallback.set(id, record);
  }

  return record;
}

export async function carregarRascunhoWizard(
  id: string = DEFAULT_WIZARD_DRAFT_ID,
): Promise<WizardDraftRecord | null> {
  if (!hasIndexedDB()) {
    return memoryWizardFallback.get(id) ?? null;
  }

  try {
    const db = await openDatabase();
    return await new Promise<WizardDraftRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_WIZARD_DRAFTS, 'readonly');
      const store = tx.objectStore(STORE_WIZARD_DRAFTS);
      const req = store.get(id);
      req.onsuccess = () => {
        db.close();
        resolve((req.result as WizardDraftRecord | undefined) ?? null);
      };
      req.onerror = () => {
        db.close();
        reject(req.error ?? new Error('Falha ao ler rascunho do IndexedDB.'));
      };
    });
  } catch {
    return memoryWizardFallback.get(id) ?? null;
  }
}

export async function limparRascunhoWizard(
  id: string = DEFAULT_WIZARD_DRAFT_ID,
): Promise<void> {
  memoryWizardFallback.delete(id);
  if (!hasIndexedDB()) {
    return;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_WIZARD_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_WIZARD_DRAFTS);
      store.delete(id);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Falha ao remover rascunho do IndexedDB.'));
      };
    });
  } catch {
    // Fallback silencioso
  }
}

export async function enfileirarLaudoOffline(
  payload: Omit<OfflineLaudoRecord, 'id' | 'criadoEm'>,
): Promise<OfflineLaudoRecord> {
  const record: OfflineLaudoRecord = {
    ...payload,
    id: `${payload.vistoriaId}-${Date.now()}`,
    criadoEm: new Date().toISOString(),
  };

  if (!hasIndexedDB()) {
    memoryLaudosFallback.set(record.id, record);
    return record;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_LAUDOS, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE_LAUDOS);
      store.put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Falha ao enfileirar laudo offline.'));
      };
    });
  } catch {
    memoryLaudosFallback.set(record.id, record);
  }

  return record;
}

export async function listarLaudosOfflinePendentes(): Promise<OfflineLaudoRecord[]> {
  if (!hasIndexedDB()) {
    return Array.from(memoryLaudosFallback.values());
  }

  try {
    const db = await openDatabase();
    return await new Promise<OfflineLaudoRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_LAUDOS, 'readonly');
      const store = tx.objectStore(STORE_OFFLINE_LAUDOS);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve((req.result as OfflineLaudoRecord[] | undefined) ?? []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error ?? new Error('Falha ao listar laudos offline.'));
      };
    });
  } catch {
    return Array.from(memoryLaudosFallback.values());
  }
}

export async function removerLaudoOffline(id: string): Promise<void> {
  memoryLaudosFallback.delete(id);
  if (!hasIndexedDB()) {
    return;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_LAUDOS, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE_LAUDOS);
      store.delete(id);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Falha ao remover laudo offline.'));
      };
    });
  } catch {
    // Fallback silencioso
  }
}

