import React, { useMemo } from 'react';
import { RetroColumn as RetroColumnType, RetroMethodColumnDef, SortOrder } from '../types';
import { RetroCard } from './RetroCard';
import { Plus } from 'lucide-react';

interface RetroColumnProps {
  column: RetroColumnType;
  columnDef?: RetroMethodColumnDef;
  voterId: string;
  sortOrder: SortOrder;
  onOpenAddModal: (columnId: string) => void;
  onVote: (columnId: string, cardId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onUpdateCard: (columnId: string, cardId: string, text: string, author?: string) => void;
  onConvertToAction?: (text: string, cardId: string, author?: string) => void;
}

export const RetroColumn: React.FC<RetroColumnProps> = ({
  column,
  columnDef,
  voterId,
  sortOrder,
  onOpenAddModal,
  onVote,
  onDeleteCard,
  onUpdateCard,
  onConvertToAction
}) => {
  // Sort cards according to current sort order
  const sortedCards = useMemo(() => {
    const list = [...column.cards];
    if (sortOrder === 'most_voted') {
      return list.sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return b.createdAt - a.createdAt;
      });
    }
    if (sortOrder === 'most_recent') {
      return list.sort((a, b) => b.createdAt - a.createdAt);
    }
    // original order
    return list;
  }, [column.cards, sortOrder]);

  const emoji = columnDef?.emoji || '📋';
  const headerBorder = columnDef?.headerBorder || 'border-blue-400';
  const badgeBg = columnDef?.badgeBg || 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="flex flex-col bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs h-full min-h-[500px] overflow-hidden">
      {/* Column Header */}
      <div className={`p-4 bg-white border-b-2 ${headerBorder} shadow-2xs`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0" role="img" aria-label={column.title}>
              {emoji}
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-800 tracking-tight truncate">
                {column.title.toUpperCase()}
              </h2>
              {column.description && (
                <p className="text-xs text-slate-500 line-clamp-1" title={column.description}>
                  {column.description}
                </p>
              )}
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border shrink-0 ${badgeBg}`}
          >
            {column.cards.length} {column.cards.length === 1 ? 'idea' : 'ideas'}
          </span>
        </div>

        {/* Add Card Quick Button in Header */}
        <button
          type="button"
          onClick={() => onOpenAddModal(column.id)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer group"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span>+ Agregar idea</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="p-3.5 flex-1 flex flex-col gap-3 overflow-y-auto min-h-[160px]">
        {sortedCards.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200/80 rounded-xl my-2">
            <span className="text-2xl opacity-40 mb-1">{emoji}</span>
            <p className="text-xs font-medium text-slate-500">Todavía no hay ideas aquí</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hacé clic en &quot;+ Agregar idea&quot; para sumar tu aporte
            </p>
          </div>
        ) : (
          sortedCards.map((card) => {
            const hasVoted = card.voters?.includes(voterId) ?? false;
            return (
              <RetroCard
                key={card.id}
                card={card}
                columnId={column.id}
                columnTitle={column.title}
                hasVoted={hasVoted}
                onVote={() => onVote(column.id, card.id)}
                onDelete={() => onDeleteCard(column.id, card.id)}
                onUpdate={(newText, newAuthor) =>
                  onUpdateCard(column.id, card.id, newText, newAuthor)
                }
                onConvertToAction={(text, cardId, author) => {
                  if (onConvertToAction) {
                    onConvertToAction(text, cardId, author);
                  }
                }}
              />
            );
          })
        )}
      </div>

      {/* Column Footer with bottom Add button if list is long */}
      {sortedCards.length >= 3 && (
        <div className="p-3 bg-white/60 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => onOpenAddModal(column.id)}
            className="w-full py-1.5 text-center text-xs font-medium text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            + Agregar otra idea a {column.title}
          </button>
        </div>
      )}
    </div>
  );
};
