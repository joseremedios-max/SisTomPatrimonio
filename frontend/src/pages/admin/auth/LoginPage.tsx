import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginPage() {
  const { login, carregando } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '');
    const senha = String(data.get('senha') || '');

    try {
      const autenticado = await login(email, senha);
      if (autenticado) {
        navigate('/admin');
      } else {
        navigate('/admin/2fa');
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Verifique as credenciais e tente novamente.',
      );
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-900">Acesso técnico</h1>
        {erro && (
          <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        <Input name="email" type="email" placeholder="E-mail" required />
        <Input name="senha" type="password" placeholder="Senha" required />
        <Button className="w-full bg-emerald-800 text-white" type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
        <p className="text-xs text-slate-500">Recuperação e desafio 2FA serão ativados pela API.</p>
      </form>
    </main>
  );
}
