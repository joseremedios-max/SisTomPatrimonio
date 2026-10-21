import type { SelectHTMLAttributes } from 'react';
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className="w-full rounded border border-slate-300 bg-white px-3 py-2" {...props}>{children}</select>; }
