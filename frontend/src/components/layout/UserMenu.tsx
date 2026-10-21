import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
export function UserMenu() { const { usuario, logout } = useAuth(); return <div className="flex items-center gap-3 text-sm">{usuario?.nome}<Button className="bg-white/10" onClick={logout}>Sair</Button></div>; }
