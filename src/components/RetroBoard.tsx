import React, { useState } from 'react';
import { RetroSession, SortOrder, RetroMethodDef } from '../types';
import { getMethodDef, RETRO_METHODS } from '../data/retroMethods';
import { RetroColumn } from './RetroColumn';
import { AddCardModal } from './AddCardModal';
import { TopTopics } from './TopTopics';
import { ActionList } from './ActionList';
import {
  SlidersHorizontal,
  Plus,
  Sparkles,
  ArrowUpDown,
  LayoutGrid,
  ListTodo,
  FileText,
  Home,
  CheckCircle2,
  Calendar,
  Users,
  Shuffle,
  ChevronDown,
  X,
  Check
} from 'lucide-react';

interface RetroBoardProps {
  retro: RetroSession;
  voterId: string;
  sortOrder: SortOrder;
  onSetSortOrder: (order: SortOrder) => void;
  topCards: Array<{
    card: any;
    columnTitle: string;
    columnId: string;
  }>;
  stats: {
    totalCards: number;
    totalVotes: number;
    totalActions: number;
    completedActions: number;
  };
  onAddCard: (columnId: string, text: string, author?: string) => void;
  onUpdateCard: (columnId: string, cardId: string, text: string, author?: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onVote: (columnId: string, cardId: string) => void;
  onAddAction: (data: {
    description: string;
    assignee: string;
    dueDate: string;
    sourceCardId?: string;
    sourceCardText?: string;
  }) => void;
  onUpdateAction: (id: string, updates: any) => void;
  onDeleteAction: (id: string) => void;
  onChangeMethod?: (newMethodId: string) => void;
  onViewSummary: () => void;
  onExitRetro: () => void;
}

export const RetroBoard: React.FC<RetroBoardProps> = ({
  retro,
  voterId,
  sortOrder,
  onSetSortOrder,
  topCards,
  stats,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onVote,
  onAddAction,
  onUpdateAction,
  onDeleteAction,
  onChangeMethod,
  onViewSummary,
  onExitRetro
}) => {
  const [activeModalColId, setActiveModalColId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'actions'>('board');
  const [showTopTopics, setShowTopTopics] = useState(true);
  const [showMethodModal, setShowMethodModal] = useState(false);

  // Retrieve dynamic configuration from retroMethods data
  const methodDef = getMethodDef(retro.method);

  const handleOpenAddModal = (colId: string) => {
    setActiveModalColId(colId);
  };

  const handleCloseAddModal = () => {
    setActiveModalColId(null);
  };

  const handleAddCardSubmit = (text: string, author?: string) => {
    if (activeModalColId) {
      onAddCard(activeModalColId, text, author);
    }
  };

  const handleConvertToAction = (text: string, cardId: string, author?: string) => {
    setActiveTab('actions');
    onAddAction({
      description: text,
      assignee: author || '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      sourceCardId: cardId,
      sourceCardText: text
    });
  };

  // Find column definition for modal
  const activeColumnDef = activeModalColId
    ? methodDef.columns.find((c) => c.id === activeModalColId) || {
        id: activeModalColId,
        title: retro.columns.find((c) => c.id === activeModalColId)?.title || 'Columna',
        description: retro.columns.find((c) => c.id === activeModalColId)?.description || '',
        emoji: '📋',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        badgeText: 'text-slate-700',
        headerBorder: 'border-slate-400',
        accentColor: 'slate',
        cardAccent: 'hover:border-slate-300'
      }
    : undefined;

  // Responsive dynamic grid classes based on column count
  const getGridColsClass = (colCount: number) => {
    switch (colCount) {
      case 1:
        return 'grid grid-cols-1 max-w-xl mx-auto gap-4 items-start';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4 items-start';
      case 3:
        // Perfectly sized 3 columns for Mad/Sad/Glad or Start/Stop/Continue
        return 'grid grid-cols-1 md:grid-cols-3 gap-4 items-start';
      case 4:
        // 4 columns for 4Ls or Sailboat
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-' + Math.min(colCount, 5) + ' gap-4 items-start';
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Dynamic badge & switcher button */}
              <button
                type="button"
                onClick={() => setShowMethodModal(true)}
                title="Hacé clic para cambiar la dinámica del tablero"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200 transition-colors cursor-pointer group"
              >
                <span>{methodDef.name}</span>
                <span className="text-[10px] text-blue-500 bg-blue-100 px-1.5 py-0.2 rounded-full">
                  {retro.columns.length} col
                </span>
                <ChevronDown className="w-3 h-3 text-blue-500 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {retro.team}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {retro.date}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {retro.sprintName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {methodDef.description}
            </p>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('board')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'board'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tablero ({stats.totalCards})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('actions')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'actions'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Acciones ({stats.totalActions})</span>
              </button>
            </div>

            {/* Ver Resumen Button */}
            <button
              type="button"
              onClick={onViewSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ver resumen</span>
            </button>
          </div>
        </div>

        {/* Sort & Filter Controls Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Ordenar ideas:</span>
            <div className="relative inline-block">
              <select
                value={sortOrder}
                onChange={(e) => onSetSortOrder(e.target.value as SortOrder)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="most_voted">👍 Más votadas</option>
                <option value="most_recent">⏱️ Más recientes</option>
                <option value="original">📋 Orden original</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>💡 <strong>{stats.totalCards}</strong> ideas</span>
            <span>•</span>
            <span>👍 <strong>{stats.totalVotes}</strong> votos</span>
            <span>•</span>
            <span>✅ <strong>{stats.completedActions}/{stats.totalActions}</strong> acciones listas</span>
          </div>
        </div>
      </div>

      {/* Top 3 Topics Section (Priorización) */}
      {topCards.length > 0 && showTopTopics && (
        <TopTopics
          topCards={topCards}
          onConvertToAction={handleConvertToAction}
        />
      )}

      {/* Main Tab Content */}
      {activeTab === 'board' ? (
        <div className={getGridColsClass(retro.columns.length)}>
          {retro.columns.map((column, index) => {
            // Find specific column definition or match by index or fallback safely
            const colDef =
              methodDef.columns.find((c) => c.id === column.id) ||
              methodDef.columns.find((c) => c.title.toLowerCase() === column.title.toLowerCase()) ||
              methodDef.columns[index] || {
                id: column.id,
                title: column.title,
                description: column.description || '',
                emoji: '📌',
                badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
                badgeText: 'text-slate-700',
                headerBorder: 'border-slate-400',
                accentColor: 'slate',
                cardAccent: 'hover:border-slate-300'
              };

            return (
              <RetroColumn
                key={column.id}
                column={column}
                columnDef={colDef}
                voterId={voterId}
                sortOrder={sortOrder}
                onOpenAddModal={handleOpenAddModal}
                onVote={onVote}
                onDeleteCard={onDeleteCard}
                onUpdateCard={onUpdateCard}
                onConvertToAction={handleConvertToAction}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <ActionList
            actions={retro.actions}
            onAddAction={onAddAction}
            onUpdateAction={onUpdateAction}
            onDeleteAction={onDeleteAction}
          />
        </div>
      )}

      {/* Bottom Actions section preview if in board mode */}
      {activeTab === 'board' && retro.actions.length > 0 && (
        <div className="mt-8">
          <ActionList
            actions={retro.actions}
            onAddAction={onAddAction}
            onUpdateAction={onUpdateAction}
            onDeleteAction={onDeleteAction}
          />
        </div>
      )}

      {/* Modal for adding a card */}
      <AddCardModal
        isOpen={Boolean(activeModalColId)}
        columnDef={activeColumnDef}
        onClose={handleCloseAddModal}
        onAdd={handleAddCardSubmit}
      />

      {/* Modal for switching retro method */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cambiar dinámica de la retrospectiva
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elegí una dinámica para adaptar el tablero y sus columnas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMethodModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto py-1">
              {Object.values(RETRO_METHODS).map((method) => {
                const isCurrent = retro.method === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      if (onChangeMethod) {
                        onChangeMethod(method.id);
                      }
                      setShowMethodModal(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900">
                          {method.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                        {method.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100/80">
                      {method.columns.map((col) => (
                        <span
                          key={col.id}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                        >
                          {col.emoji} {col.title}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMethodModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
