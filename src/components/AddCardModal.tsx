import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { RetroMethodColumnDef } from '../types';

interface AddCardModalProps {
  isOpen: boolean;
  columnDef?: RetroMethodColumnDef;
  onClose: () => void;
  onAdd: (text: string, author?: string) => void;
  defaultAuthor?: string;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnDef,
  onClose,
  onAdd,
  defaultAuthor = ''
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState(defaultAuthor);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText('');
      // focus textarea after open
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), author.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with column indicator */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {columnDef && (
              <span className="text-xl" role="img" aria-label={columnDef.title}>
                {columnDef.emoji}
              </span>
            )}
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Agregar idea {columnDef ? `en ${columnDef.title}` : ''}
              </h3>
              {columnDef?.description && (
                <p className="text-xs text-slate-500">{columnDef.description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              ¿Qué querés agregar?
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              placeholder="Escribí tu idea de forma concisa..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 resize-none transition-shadow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
              <span>Tip: Presioná Ctrl + Enter para agregar rápido</span>
              <span>{text.length} caracteres</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Tu nombre (opcional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Sofía, Carlos..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
