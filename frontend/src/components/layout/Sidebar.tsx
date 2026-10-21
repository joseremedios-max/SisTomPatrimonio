import { NavLink } from 'react-router-dom';
const links = [['/admin', 'Dashboard'], ['/admin/bens/novo', 'Novo bem'], ['/admin/vistorias', 'Vistorias'], ['/admin/juridico', 'Jurídico'], ['/admin/salvaguarda', 'Salvaguarda'], ['/admin/auditoria', 'Auditoria']];
export function Sidebar() { return <aside className="w-56 shrink-0 bg-slate-900 p-4 text-slate-100"><nav className="space-y-1">{links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `block rounded px-3 py-2 text-sm ${isActive ? 'bg-emerald-700' : 'hover:bg-slate-800'}`}>{label}</NavLink>)}</nav></aside>; }
