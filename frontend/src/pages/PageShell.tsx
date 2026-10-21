import type { ReactNode } from 'react';
export default function PageShell({ title, children }: { title: string; children?: ReactNode }) { return <section className="mx-auto max-w-6xl p-6"><h1 className="mb-6 text-3xl font-bold text-emerald-950">{title}</h1>{children ?? <p className="text-slate-600">Módulo pronto para integração com a API.</p>}</section>; }
