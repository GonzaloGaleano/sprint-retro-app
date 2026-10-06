import React, { useState } from 'react';
import { RetroSession } from '../types';
import { formatRetroAsMarkdown } from '../utils/storage';
import {
  Lightbulb,
  ThumbsUp,
  Target,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  Users,
  Award,
  Sparkles,
  Download
} from 'lucide-react';

interface SummaryProps {
  retro: RetroSession;
  onBackToBoard: () => void;
  onFinalize: () => void;
}

export const Summary: React.FC<SummaryProps> = ({
  retro,
  onBackToBoard,
  onFinalize
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate metrics
  let totalCards = 0;
  let totalVotes = 0;
  const cardsWithVotes: Array<{ text: string; votes: number; columnTitle: string }> = [];

  retro.columns.forEach((col) => {
    totalCards += col.cards.length;
    col.cards.forEach((c) => {
      totalVotes += c.votes || 0;
      cardsWithVotes.push({
        text: c.text,
        votes: c.votes || 0,
        columnTitle: col.title
      });
    });
  });

  // Top 3 cards
  cardsWithVotes.sort((a, b) => b.votes - a.votes);
  const top3 = cardsWithVotes.slice(0, 3);

  const handleCopyMarkdown = () => {
    const md = formatRetroAsMarkdown(retro);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Resumen Ejecutivo de la Sesión
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Retrospectiva — {retro.sprintName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-blue-100 mt-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-300" />
                {retro.team}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-300" />
                {retro.date}
              </span>
              <span>•</span>
              <span className="capitalize px-2 py-0.5 rounded bg-white/10 font-medium">
                {retro.method.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer"
              title="Copiar resumen en Markdown para Slack o Notion"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar acta (MD)'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Stat Metrics required by spec */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-medium uppercase tracking-wider">Ideas</span>
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-white">{totalCards}</span>
              <p className="text-[11px] text-blue-200 mt-0.5">Propuestas registradas</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-medium uppercase tracking-wider">Votos</span>
              <ThumbsUp className="w-4 h-4 text-blue-300" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-white">{totalVotes}</span>
              <p className="text-[11px] text-blue-200 mt-0.5">Participación total</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-medium uppercase tracking-wider">Temas Clave</span>
              <Target className="w-4 h-4 text-rose-300" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-white">{top3.length}</span>
              <p className="text-[11px] text-blue-200 mt-0.5">Más valorados</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-medium uppercase tracking-wider">Acciones</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-white">{retro.actions.length}</span>
              <p className="text-[11px] text-blue-200 mt-0.5">Acuerdos del sprint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Topics Highlight */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <span>🎯 Temas principales del equipo</span>
        </h2>

        {top3.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No se registraron tarjetas ni votos.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {top3.map((item, i) => (
              <div key={i} className="py-3 flex items-start justify-between gap-3 first:pt-1 last:pb-1">
                <div className="flex items-start gap-3">
                  <span className="text-base font-bold text-slate-400 shrink-0">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.text}</p>
                    <span className="text-[11px] text-slate-400 uppercase font-medium">
                      Columna: {item.columnTitle}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold shrink-0">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {item.votes} votos
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agreed Actions List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>✅ Acciones acordadas para el próximo Sprint</span>
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {retro.actions.length} comprometidas
          </span>
        </div>

        {retro.actions.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">
              No se definieron acciones en esta sesión todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {retro.actions.map((act, index) => {
              const statusMap = {
                pending: { label: 'Pendiente', color: 'bg-slate-100 text-slate-700' },
                in_progress: { label: 'En progreso', color: 'bg-amber-100 text-amber-800' },
                completed: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' }
              };
              const statusCfg = statusMap[act.status] || statusMap.pending;

              return (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {act.description}
                      </h4>
                    </div>
                    {act.sourceCardText && (
                      <p className="text-xs text-slate-400 italic">
                        Basado en: &quot;{act.sourceCardText}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 text-xs">
                    <span className="text-slate-600">
                      <strong>Responsable:</strong> {act.assignee || 'Sin asignar'}
                    </span>
                    <span className="text-slate-600">
                      <strong>Fecha:</strong> {act.dueDate || 'Sin fecha'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdown per column overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Resumen por Categorías
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {retro.columns.map((col) => (
            <div key={col.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 truncate">{col.title}</span>
                <span className="text-xs font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                  {col.cards.length}
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                {col.cards.slice(0, 3).map((c) => (
                  <li key={c.id} className="truncate list-disc list-inside text-slate-500">
                    {c.text}
                  </li>
                ))}
                {col.cards.length > 3 && (
                  <li className="text-[11px] text-slate-400 italic">
                    +{col.cards.length - 3} más...
                  </li>
                )}
                {col.cards.length === 0 && (
                  <li className="text-[11px] text-slate-400 italic">Sin ideas</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons required by spec */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToBoard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al tablero</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onFinalize}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalizar retrospectiva</span>
          </button>
        </div>
      </div>
    </div>
  );
};
