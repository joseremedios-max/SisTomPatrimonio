import { useEffect, useState, type FormEvent } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import type { UsuarioDTO } from '../../types/dtos';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'TECNICO' });
  const [mensagem, setMensagem] = useState('');
  const carregar = async () => { try { setUsuarios((await api.get<UsuarioDTO[]>('/v1/administracao/usuarios')).data); } catch (error) { setErro((error as Error).message); } };
  useEffect(() => { void carregar(); }, []);
  const alternar = async (usuario: UsuarioDTO) => { try { await api.patch(`/v1/administracao/usuarios/${usuario.id}/ativo`, null, { params: { ativo: !usuario.ativo } }); await carregar(); } catch (error) { setErro((error as Error).message); } };
  const criar = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/v1/administracao/usuarios', form);
      setForm({ nome: '', email: '', senha: '', perfil: 'TECNICO' });
      setMensagem('Usuário criado com sucesso.');
      await carregar();
    } catch (error) { setErro((error as Error).message); }
  };
  const editar = async (usuario: UsuarioDTO) => {
    const nome = window.prompt('Nome do usuário', usuario.nome);
    const email = window.prompt('E-mail do usuário', usuario.email);
    if (!nome || !email) return;
    try { await api.put(`/v1/administracao/usuarios/${usuario.id}`, { nome, email, perfil: usuario.perfil }); setMensagem('Usuário atualizado.'); await carregar(); } catch (error) { setErro((error as Error).message); }
  };
  return <PageShell title="Usuários"><p className="mb-4 text-slate-600">Gestão de acessos e perfis administrativos.</p>{erro && <p className="mb-4 text-red-700">{erro}</p>}{mensagem && <p className="mb-4 text-emerald-800">{mensagem}</p>}
    <form onSubmit={criar} className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow md:grid-cols-5">
      <input className="rounded border px-3 py-2" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      <input className="rounded border px-3 py-2" type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input className="rounded border px-3 py-2" type="password" placeholder="Senha temporária" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
      <select className="rounded border bg-white px-3 py-2" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}><option>TECNICO</option><option>JURIDICO</option><option>CONSULTOR</option><option>LEITOR</option><option>ADMIN</option></select>
      <button className="rounded bg-emerald-800 px-3 py-2 text-white" type="submit">Criar usuário</button>
    </form>
    <div className="overflow-x-auto rounded-lg bg-white shadow"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Perfil</th><th className="p-3">Status</th><th className="p-3" /></tr></thead><tbody>{usuarios.map((usuario) => <tr className="border-b" key={usuario.id}><td className="p-3">{usuario.nome}</td><td className="p-3">{usuario.email}</td><td className="p-3">{usuario.perfil}</td><td className="p-3">{usuario.ativo ? 'Ativo' : 'Inativo'}</td><td className="flex gap-3 p-3"><button className="text-emerald-800 underline" onClick={() => void editar(usuario)}>Editar</button><button className="text-emerald-800 underline" onClick={() => void alternar(usuario)}>{usuario.ativo ? 'Desativar' : 'Ativar'}</button></td></tr>)}</tbody></table></div></PageShell>;
}
