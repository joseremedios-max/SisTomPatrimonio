import type { ReactNode } from 'react';
export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"><div className="mb-4 flex justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Fechar">×</button></div>{children}</div></div>;
}
