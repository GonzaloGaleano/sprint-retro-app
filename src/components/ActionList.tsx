import React, { useState } from 'react';
import { ActionItem, ActionStatus } from '../types';
import { CheckCircle2, Clock, PlayCircle, Plus, Trash2, Calendar, User, Edit2, Check, X, ShieldAlert } from 'lucide-react';

interface ActionListProps {
  actions: ActionItem[];
  onAddAction: (data: {
    description: string;
    assignee: string;
    dueDate: string;
    sourceCardId?: string;
    sourceCardText?: string;
  }) => void;
  onUpdateAction: (id: string, updates: Partial<ActionItem>) => void;
  onDeleteAction: (id: string) => void;
}

export const ActionList: React.FC<ActionListProps> = ({
  actions,
  onAddAction,
  onUpdateAction,
  onDeleteAction
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    // Default to +7 days
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAddAction({
      description: description.trim(),
      assignee: assignee.trim(),
      dueDate: dueDate || ''
    });
    setDescription('');
    setAssignee('');
    setShowAddForm(false);
  };

  const startEdit = (action: ActionItem) => {
    setEditingId(action.id);
    setEditDesc(action.description);
    setEditAssignee(action.assignee);
    setEditDueDate(action.dueDate);
  };

  const saveEdit = (id: string) => {
    if (!editDesc.trim()) return;
    onUpdateAction(id, {
      description: editDesc.trim(),
      assignee: editAssignee.trim(),
      dueDate: editDueDate
    });
    setEditingId(null);
  };

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completada',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case 'in_progress':
        return {
          label: 'En progreso',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: PlayCircle
        };
      case 'pending':
      default:
        return {
          label: 'Pendiente',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              Plan de Acciones Acordadas
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {actions.length} {actions.length === 1 ? 'acción' : 'acciones'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compromisos con responsable y fecha objetivo para implementar mejoras en el próximo sprint.
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            + Nueva acción manual
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nueva Acción para el Sprint
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Descripción de la acción *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              placeholder="¿Qué compromiso específico va a asumir el equipo?"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Responsable
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Ej: Gonzalo, Equipo..."
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Fecha objetivo
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!description.trim()}
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40"
            >
              Guardar acción
            </button>
          </div>
        </form>
      )}

      {/* Actions Grid */}
      {actions.length === 0 ? (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl my-4">
          <p className="text-sm font-medium text-slate-600">
            Todavía no hay acciones acordadas
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Hacé clic en &quot;Convertir en acción&quot; desde las tarjetas del tablero o los Temas Principales para sumar compromisos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {actions.map((act, idx) => {
            const isEditingThis = editingId === act.id;
            const statusInfo = getStatusBadge(act.status);
            const StatusIcon = statusInfo.icon;

            if (isEditingThis) {
              return (
                <div
                  key={act.id}
                  className="bg-white rounded-xl p-4 border-2 border-blue-400 shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Acción #{idx + 1}
                    </span>
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={2}
                      className="w-full text-xs rounded border border-slate-300 p-2 text-slate-800"
                    />
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-medium">Responsable</label>
                      <input
                        type="text"
                        value={editAssignee}
                        onChange={(e) => setEditAssignee(e.target.value)}
                        className="w-full text-xs rounded border border-slate-300 px-2 py-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-medium">Fecha objetivo</label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full text-xs rounded border border-slate-300 px-2 py-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(act.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={act.id}
                className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                  act.status === 'completed'
                    ? 'bg-slate-50/80 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 tracking-wider">
                      Acción #{idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(act)}
                        title="Editar acción"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAction(act.id)}
                        title="Eliminar acción"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-sm font-medium text-slate-800 leading-snug break-words ${act.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                    {act.description}
                  </p>

                  {act.sourceCardText && (
                    <p className="text-[11px] text-slate-400 mt-2 bg-slate-50 p-1.5 rounded border border-slate-100 italic line-clamp-2" title={`Origen: ${act.sourceCardText}`}>
                      Origen: &quot;{act.sourceCardText}&quot;
                    </p>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Responsable:</span>
                      <span className="font-semibold text-slate-800">
                        {act.assignee || 'Sin asignar'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fecha:</span>
                      <span className="font-medium text-slate-700">
                        {act.dueDate || 'Sin fecha definida'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status selector */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Estado:
                  </span>
                  <select
                    value={act.status}
                    onChange={(e) =>
                      onUpdateAction(act.id, {
                        status: e.target.value as ActionStatus
                      })
                    }
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${statusInfo.bg}`}
                  >
                    <option value="pending">⏳ Pendiente</option>
                    <option value="in_progress">⚡ En progreso</option>
                    <option value="completed">✅ Completada</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
