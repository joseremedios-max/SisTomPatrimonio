import React from 'react';
import type { EventoBemDTO } from '../../types/dtos';

interface EventoBemTimelineProps {
  eventos: EventoBemDTO[];
}

export const EventoBemTimeline: React.FC<EventoBemTimelineProps> = ({ eventos }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Linha do Tempo Cronológica do Bem</h3>
      {eventos.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">Nenhum marco histórico ou intervenção registrada para este bem.</p>
      ) : (
        <div className="relative border-l-2 border-emerald-500 ml-4 space-y-6 pl-6 py-2">
          {eventos.map((ev) => (
            <div key={ev.id} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-sm" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {ev.tipo}
                </span>
                <span className="text-xs text-slate-400">
                  {ev.anoInicio ? `Ano: ${ev.anoInicio}` : ev.dataInicio}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-1">{ev.titulo}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.descricao}</p>
              {ev.custo && (
                <div className="text-xs text-slate-500 font-medium mt-2">
                  Investimento: <span className="text-emerald-700">R$ {ev.custo.toLocaleString('pt-BR')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
