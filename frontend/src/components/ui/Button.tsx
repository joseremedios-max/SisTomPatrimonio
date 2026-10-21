import type { ButtonHTMLAttributes } from 'react';
export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`rounded px-4 py-2 font-medium transition hover:opacity-90 disabled:opacity-50 ${className}`} {...props} />;
}
