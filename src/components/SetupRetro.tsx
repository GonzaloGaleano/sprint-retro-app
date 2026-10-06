import React, { useState } from 'react';
import { RetroSession } from '../types';
import { RETRO_METHODS } from '../data/retroMethods';
import {
  Calendar,
  Users,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  History,
  Trash2,
  Play
} from 'lucide-react';

interface SetupRetroProps {
  currentRetro: RetroSession | null;
  history: RetroSession[];
  onStartNew: (params: { sprintName: string; date: string; team: string; method: string }) => void;
  onContinueCurrent: () => void;
  onLoadHistory: (retro: RetroSession) => void;
  onDeleteHistory: (id: string) => void;
  onLoadSample: (methodId?: string) => void;
}

export const SetupRetro: React.FC<SetupRetroProps> = ({
  currentRetro,
  history,
  onStartNew,
  onContinueCurrent,
  onLoadHistory,
  onDeleteHistory,
  onLoadSample
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [sprintName, setSprintName] = useState('Sprint 25');
  const [team, setTeam] = useState('Equipo Frontend & Core');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMethod, setSelectedMethod] = useState<string>('mad-sad-glad');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintName.trim() || !team.trim() || !date) return;
    setStep(2);
  };

  const handleFinish = () => {
    onStartNew({
      sprintName,
      date,
      team,
      method: selectedMethod
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Welcome */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          Scrum Agile Toolkit
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sprint Retrospective
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Facilitá la reunión de retrospectiva de tu equipo, recolectá ideas en vivo, votá los temas clave y acordá acciones concretas con dinámicas ágiles probadas.
        </p>
      </div>

      {/* Option to Continue Existing Retro if Available */}
      {currentRetro && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Sesión activa encontrada
            </span>
            <h3 className="text-base font-bold text-slate-800">
              {currentRetro.sprintName}
            </h3>
            <p className="text-xs text-slate-500">
              {currentRetro.team} • {currentRetro.date} • Dinámica:{' '}
              {RETRO_METHODS[currentRetro.method]?.name || currentRetro.method} ({currentRetro.columns.length} columnas)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onContinueCurrent}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continuar retrospectiva</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {step === 1 ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nueva retrospectiva
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paso 1 de 2: Información del Sprint y equipo
                </p>
              </div>

              {/* Sample data quick buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLoadSample('mad-sad-glad')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  title="Cargar demo con dinámica Mad / Sad / Glad (3 columnas)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Mad/Sad/Glad</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLoadSample('start-stop-continue')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Cargar demo con dinámica Start / Stop / Continue"
                >
                  <span>Demo Start/Stop</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nombre del Sprint
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    placeholder="Ej: Sprint 24 — Onboarding & Auth"
                    className="w-full text-sm rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Fecha
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Equipo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      placeholder="Ej: Mobile Squad, Pagos, Squad Alpha"
                      className="w-full text-sm rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <span>Continuar a elegir dinámica</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Seleccionar dinámica
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paso 2 de 2: El tablero se adaptará automáticamente a la cantidad y nombres de columnas de la dinámica
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(RETRO_METHODS).map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            {method.name}
                          </h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {method.columns.length} columnas
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="retroMethod"
                          checked={isSelected}
                          onChange={() => setSelectedMethod(method.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {method.description}
                      </p>
                    </div>

                    {/* Columns Preview */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Columnas ({method.columns.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {method.columns.map((col) => (
                          <span
                            key={col.id}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${col.badgeBg}`}
                            title={col.description}
                          >
                            <span>{col.emoji}</span>
                            <span>{col.title}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                Retrospectiva para <strong className="text-slate-800">{sprintName}</strong> ({team}) con dinámica{' '}
                <strong className="text-blue-700">{RETRO_METHODS[selectedMethod]?.name}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Comenzar retrospectiva</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History of previous retros if available */}
      {history.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3 px-1">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Retrospectivas guardadas en este navegador ({history.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((hist) => {
              const totalCards = hist.columns.reduce(
                (sum, c) => sum + c.cards.length,
                0
              );
              const totalActions = hist.actions.length;

              return (
                <div
                  key={hist.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="text-sm font-bold text-slate-800 truncate" title={hist.sprintName}>
                        {hist.sprintName}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(hist.id);
                        }}
                        title="Eliminar de historial"
                        className="text-slate-300 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500">
                      {hist.team} • {hist.date} • {RETRO_METHODS[hist.method]?.name || hist.method}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>💡 {totalCards} ideas</span>
                      <span>✅ {totalActions} acciones</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onLoadHistory(hist)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Abrir retro →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
