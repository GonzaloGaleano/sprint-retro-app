import React, { useState } from 'react';
import { useRetro, getShareUrl } from './hooks/useRetro';
import { isSupabaseConfigured } from './lib/supabase';
import { SetupRetro } from './components/SetupRetro';
import { RetroBoard } from './components/RetroBoard';
import { Summary } from './components/Summary';
import {
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Plus,
  Github,
  CheckCircle2,
  AlertCircle,
  Link2,
  Loader2,
  Cloud,
  CloudOff
} from 'lucide-react';

export default function App() {
  const {
    retro,
    activeId,
    voterId,
    sortOrder,
    setSortOrder,
    history,
    syncStatus,
    syncError,
    createNewRetro,
    loadRetro,
    loadSample,
    changeMethod,
    addCard,
    updateCard,
    deleteCard,
    toggleVote,
    addAction,
    updateAction,
    deleteAction,
    setCompleted,
    resetCurrent,
    deleteSavedRetro,
    topVotedCards,
    stats
  } = useRetro();

  const [currentView, setCurrentView] = useState<'setup' | 'board' | 'summary'>(() => {
    return retro || activeId ? 'board' : 'setup';
  });

  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!retro) return;
    const url = getShareUrl(retro.id);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copiá este link para compartir la retro:', url);
      return;
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleStartNew = (params: {
    sprintName: string;
    date: string;
    team: string;
    method: string;
  }) => {
    createNewRetro(params);
    setCurrentView('board');
  };

  const handleContinue = () => {
    setCurrentView('board');
  };

  const handleLoadSample = (methodId: string = 'mad-sad-glad') => {
    loadSample(methodId);
    setCurrentView('board');
  };

  const handleFinalize = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (retro) {
                  setCurrentView('board');
                } else {
                  setCurrentView('setup');
                }
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
                R
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  RetroSprint
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Scrum MVP
                </span>
              </div>
            </button>

            {retro && currentView !== 'setup' && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 pl-3 border-l border-slate-200">
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {retro.sprintName}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {retro ? (
              <>
                {isSupabaseConfigured && (
                  <span
                    className="hidden sm:inline-flex items-center"
                    title={
                      syncStatus === 'synced'
                        ? 'Sincronizado en tiempo real'
                        : syncStatus === 'loading'
                          ? 'Sincronizando…'
                          : `Error de sincronización${syncError ? `: ${syncError}` : ''}`
                    }
                  >
                    {syncStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    ) : syncStatus === 'synced' && !syncError ? (
                      <Cloud className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <CloudOff className="w-4 h-4 text-red-500" />
                    )}
                  </span>
                )}

                {isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copiar link para que otras personas se sumen a esta retro"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {linkCopied ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span className="hidden sm:inline">{linkCopied ? '¡Link copiado!' : 'Compartir'}</span>
                  </button>
                )}

                {currentView === 'board' ? (
                  <button
                    type="button"
                    onClick={() => setCurrentView('summary')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Resumen</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentView('board')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Volver al Tablero</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowConfirmNew(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nueva retro</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLoadSample('mad-sad-glad')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="Cargar demo con dinámica Mad / Sad / Glad"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Mad/Sad/Glad</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {!isSupabaseConfigured && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <span>
              Supabase no está configurado: la retro solo se guarda en este navegador y no se puede compartir.
              Definí <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en <code>.env.local</code>.
            </span>
          </div>
        )}

        {!retro && activeId && currentView !== 'setup' ? (
          <div className="max-w-md mx-auto mt-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 space-y-4">
            {syncStatus === 'loading' ? (
              <>
                <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">Cargando retrospectiva…</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
                <p className="text-sm font-semibold text-slate-800">
                  {syncStatus === 'not_found'
                    ? 'No encontramos esta retrospectiva. Revisá que el link sea correcto.'
                    : 'No se pudo cargar la retrospectiva.'}
                </p>
                {syncError && <p className="text-xs text-slate-500">{syncError}</p>}
                <button
                  type="button"
                  onClick={() => {
                    resetCurrent();
                    setCurrentView('setup');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Ir al inicio
                </button>
              </>
            )}
          </div>
        ) : !retro || currentView === 'setup' ? (
          <SetupRetro
            currentRetro={retro}
            history={history}
            onStartNew={handleStartNew}
            onContinueCurrent={handleContinue}
            onLoadHistory={(hist) => {
              loadRetro(hist);
              setCurrentView('board');
            }}
            onDeleteHistory={deleteSavedRetro}
            onLoadSample={handleLoadSample}
          />
        ) : currentView === 'summary' ? (
          <Summary
            retro={retro}
            onBackToBoard={() => setCurrentView('board')}
            onFinalize={handleFinalize}
            onReopen={() => setCompleted(false)}
          />
        ) : (
          <RetroBoard
            retro={retro}
            voterId={voterId}
            sortOrder={sortOrder}
            onSetSortOrder={setSortOrder}
            topCards={topVotedCards}
            stats={stats}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onVote={toggleVote}
            onAddAction={addAction}
            onUpdateAction={updateAction}
            onDeleteAction={deleteAction}
            onChangeMethod={changeMethod}
            onViewSummary={() => setCurrentView('summary')}
            onExitRetro={() => setCurrentView('setup')}
          />
        )}
      </main>

      {/* Confirmation Modal to Start New Retro */}
      {showConfirmNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ¿Comenzar una nueva retrospectiva?
                </h3>
                <p className="text-xs text-slate-500">
                  Tu sesión actual se guardará automáticamente en el historial de este navegador.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Seguir en esta
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmNew(false);
                  setCurrentView('setup');
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Ir a nueva retro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/50 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sprint Retrospective App • Scrum Agile Team Collaboration</span>
          <span className="text-slate-400">
            {isSupabaseConfigured
              ? 'Colaboración en tiempo real • Compartí el link con tu equipo'
              : 'Persistencia en LocalStorage • Modo local'}
          </span>
        </div>
      </footer>
    </div>
  );
}
