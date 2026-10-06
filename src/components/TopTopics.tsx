import React from 'react';
import { RetroCard } from '../types';
import { Target, ThumbsUp, ArrowRight, Sparkles } from 'lucide-react';

interface TopTopicsProps {
  topCards: Array<{
    card: RetroCard;
    columnTitle: string;
    columnId: string;
  }>;
  onConvertToAction: (cardText: string, cardId: string, author?: string) => void;
}

export const TopTopics: React.FC<TopTopicsProps> = ({
  topCards,
  onConvertToAction
}) => {
  if (topCards.length === 0) {
    return null;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const rankColors = [
    'border-amber-300 bg-amber-50/70 text-amber-900',
    'border-slate-300 bg-slate-50/70 text-slate-800',
    'border-amber-600/30 bg-amber-900/5 text-amber-950'
  ];

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🎯 Temas principales</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200">
                Top {topCards.length} más votadas
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Las ideas priorizadas por el equipo para convertir en acuerdos y acciones concretas.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {topCards.map((item, index) => {
          return (
            <div
              key={item.card.id}
              className="bg-slate-800/90 border border-slate-700 hover:border-slate-600 rounded-xl p-3.5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>{medals[index] || `#${index + 1}`}</span>
                    <span className="text-[11px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-700/60 uppercase">
                      {item.columnTitle}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-900/60 border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded-full">
                    <ThumbsUp className="w-3 h-3 fill-current" />
                    <span>{item.card.votes}</span>
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-200 leading-snug break-words">
                  {item.card.text}
                </p>

                {item.card.author && (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Por: <span className="text-slate-300 font-medium">{item.card.author}</span>
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onConvertToAction(
                      item.card.text,
                      item.card.id,
                      item.card.author
                    )
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <span>Convertir en acción</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
