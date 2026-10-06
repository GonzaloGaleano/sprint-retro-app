import { RetroMethodDef, RetroSession, RetroColumn } from '../types';

export const RETRO_METHODS: Record<string, RetroMethodDef> = {
  'start-stop-continue': {
    id: 'start-stop-continue',
    name: 'Start / Stop / Continue',
    description: 'Enfocado en acciones concretas y hábitos del equipo para el próximo sprint.',
    columns: [
      {
        id: 'start',
        title: 'Start',
        description: '¿Qué deberíamos empezar a hacer?',
        emoji: '🟢',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: 'text-emerald-700',
        headerBorder: 'border-emerald-400',
        accentColor: 'emerald',
        cardAccent: 'hover:border-emerald-300'
      },
      {
        id: 'stop',
        title: 'Stop',
        description: '¿Qué deberíamos dejar de hacer?',
        emoji: '🔴',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeText: 'text-rose-700',
        headerBorder: 'border-rose-400',
        accentColor: 'rose',
        cardAccent: 'hover:border-rose-300'
      },
      {
        id: 'continue',
        title: 'Continue',
        description: '¿Qué deberíamos seguir haciendo?',
        emoji: '🔵',
        badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
        badgeText: 'text-sky-700',
        headerBorder: 'border-sky-400',
        accentColor: 'sky',
        cardAccent: 'hover:border-sky-300'
      }
    ]
  },
  'mad-sad-glad': {
    id: 'mad-sad-glad',
    name: 'Mad / Sad / Glad',
    description: 'Enfocado en el aspecto emocional y la moral del equipo durante la iteración.',
    columns: [
      {
        id: 'mad',
        title: 'Mad',
        description: '¿Qué nos frustró o generó enojo en el sprint?',
        emoji: '😡',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeText: 'text-amber-800',
        headerBorder: 'border-amber-500',
        accentColor: 'amber',
        cardAccent: 'hover:border-amber-300'
      },
      {
        id: 'sad',
        title: 'Sad',
        description: '¿Qué nos desanimó o no cumplió expectativas?',
        emoji: '😢',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        badgeText: 'text-indigo-700',
        headerBorder: 'border-indigo-400',
        accentColor: 'indigo',
        cardAccent: 'hover:border-indigo-300'
      },
      {
        id: 'glad',
        title: 'Glad',
        description: '¿Qué nos alegró, motivó o salió excelente?',
        emoji: '😀',
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
        badgeText: 'text-teal-700',
        headerBorder: 'border-teal-400',
        accentColor: 'teal',
        cardAccent: 'hover:border-teal-300'
      }
    ]
  },
  '4ls': {
    id: '4ls',
    name: '4Ls (Liked, Learned, Lacked, Longed)',
    description: 'Estructura reflexiva sobre logros, aprendizajes, carencias y deseos.',
    columns: [
      {
        id: 'liked',
        title: 'Liked',
        description: '¿Qué cosas disfrutamos y salieron muy bien?',
        emoji: '💚',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: 'text-emerald-700',
        headerBorder: 'border-emerald-400',
        accentColor: 'emerald',
        cardAccent: 'hover:border-emerald-300'
      },
      {
        id: 'learned',
        title: 'Learned',
        description: '¿Qué aprendizajes o descubrimientos obtuvimos?',
        emoji: '💡',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeText: 'text-amber-700',
        headerBorder: 'border-amber-400',
        accentColor: 'amber',
        cardAccent: 'hover:border-amber-300'
      },
      {
        id: 'lacked',
        title: 'Lacked',
        description: '¿Qué nos faltó o impidió un mejor resultado?',
        emoji: '⚠️',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeText: 'text-rose-700',
        headerBorder: 'border-rose-400',
        accentColor: 'rose',
        cardAccent: 'hover:border-rose-300'
      },
      {
        id: 'longed',
        title: 'Longed For',
        description: '¿Qué deseamos tener o incorporar a futuro?',
        emoji: '🚀',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        badgeText: 'text-purple-700',
        headerBorder: 'border-purple-400',
        accentColor: 'purple',
        cardAccent: 'hover:border-purple-300'
      }
    ]
  },
  sailboat: {
    id: 'sailboat',
    name: 'Sailboat (El Velero)',
    description: 'Metáfora visual del velero para identificar impulsores, anclas y riesgos.',
    columns: [
      {
        id: 'wind',
        title: 'Viento',
        description: '¿Qué nos impulsa y hace avanzar más rápido?',
        emoji: '⛵',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        badgeText: 'text-blue-700',
        headerBorder: 'border-blue-400',
        accentColor: 'blue',
        cardAccent: 'hover:border-blue-300'
      },
      {
        id: 'anchors',
        title: 'Anclas',
        description: '¿Qué nos frena o ralentiza el ritmo?',
        emoji: '⚓',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
        badgeText: 'text-slate-700',
        headerBorder: 'border-slate-400',
        accentColor: 'slate',
        cardAccent: 'hover:border-slate-300'
      },
      {
        id: 'rocks',
        title: 'Rocas',
        description: '¿Qué riesgos o amenazas vemos en el horizonte?',
        emoji: '🪨',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeText: 'text-amber-700',
        headerBorder: 'border-amber-400',
        accentColor: 'amber',
        cardAccent: 'hover:border-amber-300'
      },
      {
        id: 'sun',
        title: 'Destino',
        description: '¿Hacia dónde queremos ir y qué meta alcanzar?',
        emoji: '☀️',
        badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
        badgeText: 'text-orange-700',
        headerBorder: 'border-orange-400',
        accentColor: 'orange',
        cardAccent: 'hover:border-orange-300'
      }
    ]
  }
};

export function getMethodDef(methodId: string): RetroMethodDef {
  return RETRO_METHODS[methodId] || RETRO_METHODS['start-stop-continue'];
}

export function createEmptyColumnsForMethod(methodId: string): RetroColumn[] {
  const method = getMethodDef(methodId);
  return method.columns.map((col) => ({
    id: col.id,
    title: col.title,
    description: col.description,
    cards: []
  }));
}

export function getSampleRetroSession(currentVoterId: string, methodId: string = 'start-stop-continue'): RetroSession {
  const now = Date.now();

  if (methodId === 'mad-sad-glad') {
    return {
      id: 'retro-sample-msg-24',
      sprintName: 'Sprint 24 — Performance & Mobile App',
      date: '2026-10-06',
      team: 'Equipo Core & Mobile',
      method: 'mad-sad-glad',
      createdAt: now - 3600000,
      updatedAt: now,
      columns: [
        {
          id: 'mad',
          title: 'Mad',
          description: '¿Qué nos frustró o generó enojo en el sprint?',
          cards: [
            {
              id: 'msg-1',
              text: 'Interrupciones constantes y reuniones imprevistas durante los días de entrega.',
              author: 'Agustín',
              votes: 7,
              voters: [currentVoterId, 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'],
              createdAt: now - 3200000
            },
            {
              id: 'msg-2',
              text: 'El ambiente de pruebas se cayó 3 veces el último jueves antes de release.',
              author: 'Sofía',
              votes: 6,
              voters: [currentVoterId, 'user-3', 'user-4', 'user-5', 'user-7', 'user-8'],
              createdAt: now - 2900000
            },
            {
              id: 'msg-3',
              text: 'Falta de definiciones claras en las historias de diseño UI al iniciar el sprint.',
              author: 'Gonzalo',
              votes: 3,
              voters: ['user-2', 'user-4', 'user-5'],
              createdAt: now - 2600000
            }
          ]
        },
        {
          id: 'sad',
          title: 'Sad',
          description: '¿Qué nos desanimó o no cumplió expectativas?',
          cards: [
            {
              id: 'msg-4',
              text: 'Tuvimos que postergar la funcionalidad de notificaciones push para el próximo sprint.',
              author: 'Camila',
              votes: 5,
              voters: [currentVoterId, 'user-2', 'user-3', 'user-6', 'user-8'],
              createdAt: now - 2400000
            },
            {
              id: 'msg-5',
              text: 'No logramos tiempo suficiente para realizar pruebas cruzadas entre compañeros.',
              author: 'Martín',
              votes: 4,
              voters: ['user-2', 'user-3', 'user-5', 'user-7'],
              createdAt: now - 2100000
            }
          ]
        },
        {
          id: 'glad',
          title: 'Glad',
          description: '¿Qué nos alegró, motivó o salió excelente?',
          cards: [
            {
              id: 'msg-6',
              text: 'Excelente colaboración y predisposición del equipo para destrabar el bug crítico de pagos.',
              author: 'Lucía',
              votes: 9,
              voters: [currentVoterId, 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
              createdAt: now - 1800000
            },
            {
              id: 'msg-7',
              text: 'La migración a la nueva arquitectura redujo los tiempos de carga en un 40%.',
              author: 'Facundo',
              votes: 5,
              voters: [currentVoterId, 'user-3', 'user-4', 'user-6', 'user-7'],
              createdAt: now - 1500000
            },
            {
              id: 'msg-8',
              text: 'Tuvimos dailies muy puntuales y el nuevo formato de standup funcionó genial.',
              author: 'Valeria',
              votes: 3,
              voters: ['user-4', 'user-5', 'user-6'],
              createdAt: now - 1200000
            }
          ]
        }
      ],
      actions: [
        {
          id: 'act-msg-1',
          description: 'Implementar "No Meeting Mornings" los martes y jueves para foco de desarrollo.',
          assignee: 'Agustín',
          dueDate: '2026-10-12',
          status: 'pending',
          createdAt: now - 1000000,
          sourceCardId: 'msg-1',
          sourceCardText: 'Interrupciones constantes y reuniones imprevistas durante los días de entrega.'
        },
        {
          id: 'act-msg-2',
          description: 'Configurar alertas automáticas de monitoreo y reinicio del entorno de QA en staging.',
          assignee: 'Sofía',
          dueDate: '2026-10-11',
          status: 'in_progress',
          createdAt: now - 800000,
          sourceCardId: 'msg-2',
          sourceCardText: 'El ambiente de pruebas se cayó 3 veces el último jueves antes de release.'
        }
      ]
    };
  }

  return {
    id: 'retro-sample-24',
    sprintName: 'Sprint 24 — Checkout Flow & Payments',
    date: '2026-10-06',
    team: 'Equipo Mobile & Web',
    method: 'start-stop-continue',
    createdAt: now - 3600000,
    updatedAt: now,
    columns: [
      {
        id: 'start',
        title: 'Start',
        description: '¿Qué deberíamos empezar a hacer?',
        cards: [
          {
            id: 'c-1',
            text: 'Hacer refinement técnico 24 horas antes de la Sprint Planning.',
            author: 'Gonzalo',
            votes: 8,
            voters: [currentVoterId, 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8'],
            createdAt: now - 3000000
          },
          {
            id: 'c-2',
            text: 'Incorporar pair programming para tareas con dependencias críticas del backend.',
            author: 'Lucía',
            votes: 4,
            voters: ['user-2', 'user-3', 'user-5', 'user-6'],
            createdAt: now - 2800000
          },
          {
            id: 'c-3',
            text: 'Definir checklists de pruebas de aceptación antes de pasar tickets a QA.',
            author: 'Martín',
            votes: 3,
            voters: ['user-3', 'user-4', 'user-5'],
            createdAt: now - 2500000
          }
        ]
      },
      {
        id: 'stop',
        title: 'Stop',
        description: '¿Qué deberíamos dejar de hacer?',
        cards: [
          {
            id: 'c-4',
            text: 'Reducir historias grandes y no dividirlas a mitad del sprint.',
            author: 'Sofía',
            votes: 6,
            voters: [currentVoterId, 'user-2', 'user-4', 'user-6', 'user-7', 'user-8'],
            createdAt: now - 2400000
          },
          {
            id: 'c-5',
            text: 'Evitar interrupciones no planificadas durante las mañanas de desarrollo profundo.',
            author: 'Facundo',
            votes: 4,
            voters: ['user-2', 'user-5', 'user-7', 'user-8'],
            createdAt: now - 2000000
          }
        ]
      },
      {
        id: 'continue',
        title: 'Continue',
        description: '¿Qué deberíamos seguir haciendo?',
        cards: [
          {
            id: 'c-6',
            text: 'Mejorar comunicación y feedback rápido en los code reviews de pull requests.',
            author: 'Camila',
            votes: 5,
            voters: [currentVoterId, 'user-2', 'user-3', 'user-5', 'user-7'],
            createdAt: now - 1800000
          },
          {
            id: 'c-7',
            text: 'Mantener las dailies ágiles y con foco estricto de 15 minutos.',
            author: 'Agustín',
            votes: 4,
            voters: ['user-3', 'user-4', 'user-6', 'user-8'],
            createdAt: now - 1500000
          }
        ]
      }
    ],
    actions: [
      {
        id: 'a-1',
        description: 'Hacer refinement 24h antes de la planning con criterios de aceptación validados.',
        assignee: 'Gonzalo',
        dueDate: '2026-10-10',
        status: 'in_progress',
        createdAt: now - 1200000,
        sourceCardId: 'c-1',
        sourceCardText: 'Hacer refinement técnico 24 horas antes de la Sprint Planning.'
      },
      {
        id: 'a-2',
        description: 'Limitar historias de usuario a un máximo de 5 story points.',
        assignee: 'Sofía',
        dueDate: '2026-10-12',
        status: 'pending',
        createdAt: now - 1000000,
        sourceCardId: 'c-4',
        sourceCardText: 'Reducir historias grandes y no dividirlas a mitad del sprint.'
      }
    ]
  };
}
