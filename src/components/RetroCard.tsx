import React, { useState } from 'react';
import { RetroCard as RetroCardType } from '../types';
import { VotingButton } from './VotingButton';
import { Trash2, Edit3, Check, X, ArrowRight, User } from 'lucide-react';

interface RetroCardProps {
  card: RetroCardType;
  columnId: string;
  columnTitle?: string;
  hasVoted: boolean;
  onVote: () => void;
  onDelete: () => void;
  onUpdate: (newText: string, newAuthor?: string) => void;
  onConvertToAction?: (text: string, cardId: string, author?: string) => void;
}

export const RetroCard: React.FC<RetroCardProps> = ({
  card,
  hasVoted,
  onVote,
  onDelete,
  onUpdate,
  onConvertToAction
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);
  const [editAuthor, setEditAuthor] = useState(card.author || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!editText.trim()) return;
    onUpdate(editText.trim(), editAuthor.trim() || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(card.text);
    setEditAuthor(card.author || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-4 border-2 border-blue-400 shadow-sm transition-all text-slate-800">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Editar idea
        </label>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          autoFocus
          className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 resize-none"
          placeholder="Escribí tu idea..."
        />
        <div className="mt-2.5">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Autor (opcional)
          </label>
          <input
            type="text"
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            placeholder="Tu nombre"
          />
        </div>
        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editText.trim()}
            className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Guardar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top action buttons (revealed on hover/focus or touch) */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap flex-1 break-words">
          {card.text}
        </p>

        <div className="opacity-80 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Editar tarjeta"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-md p-0.5">
              <button
                type="button"
                onClick={onDelete}
                title="Confirmar eliminación"
                className="px-1.5 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 rounded cursor-pointer"
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                title="Cancelar"
                className="p-0.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              title="Eliminar tarjeta"
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer: Author, Voting Button & Convert Action */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {card.author ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium max-w-[120px] truncate" title={`Autor: ${card.author}`}>
              <User className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{card.author}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Anónimo</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onConvertToAction && (
            <button
              type="button"
              onClick={() => onConvertToAction(card.text, card.id, card.author)}
              title="Convertir esta idea en una acción"
              className="text-xs font-medium text-slate-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Acción</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <VotingButton
            votes={card.votes}
            hasVoted={hasVoted}
            onToggle={(e) => {
              e.stopPropagation();
              onVote();
            }}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
