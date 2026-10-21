import { useEffect, useState } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState('');
  useEffect(() => { api.get<Array<{ chave: string; valor: string }>>('/v1/configuracoes').then((r) => setConfiguracoes(Object.fromEntries(r.data.map((item) => [item.chave, item.valor])))); }, []);
  const salvar = async (chave: string) => { await api.put(`/v1/configuracoes/${chave}`, { chave, valor: configuracoes[chave] ?? '' }); setMensagem('Configuração salva.'); };
  const campos = [['sessao', 'Política de sessão'], ['upload_maximo_mb', 'Upload máximo (MB)'], ['ambiente', 'Ambiente operacional']];
  return <PageShell title="Configurações"><div className="space-y-4 rounded-lg bg-white p-5 shadow">{campos.map(([chave, label]) => <label className="block text-sm font-medium" key={chave}>{label}<div className="mt-1 flex gap-2"><input className="w-full rounded border px-3 py-2" value={configuracoes[chave] ?? ''} onChange={(e) => setConfiguracoes({ ...configuracoes, [chave]: e.target.value })} /><button className="rounded bg-emerald-800 px-3 text-white" onClick={() => void salvar(chave)}>Salvar</button></div></label>)}{mensagem && <p className="text-emerald-800">{mensagem}</p>}</div></PageShell>;
}
