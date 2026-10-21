import type { InputHTMLAttributes } from 'react';
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-700" {...props} />;
}
