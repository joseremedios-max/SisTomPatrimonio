import type { ReactNode } from 'react';
export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{headers.map((h) => <th className="px-4 py-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr className="border-t" key={i}>{row.map((cell, j) => <td className="px-4 py-3" key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
