import { RetroSession } from '../types';

const STORAGE_KEY_CURRENT = 'retro_current_session';
const STORAGE_KEY_VOTER_ID = 'retro_voter_id';
const STORAGE_KEY_HISTORY = 'retro_sessions_history';

/**
 * Returns a persistent unique identifier for this browser/tab session.
 */
export function getVoterId(): string {
  try {
    let voterId = localStorage.getItem(STORAGE_KEY_VOTER_ID);
    if (!voterId) {
      voterId = 'voter_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_VOTER_ID, voterId);
    }
    return voterId;
  } catch (e) {
    return 'voter_temp_' + Math.random().toString(36).substring(2, 8);
  }
}

/**
 * Load the active retrospective session from localStorage.
 */
export function loadCurrentRetro(): RetroSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (!raw) return null;
    return JSON.parse(raw) as RetroSession;
  } catch (error) {
    console.error('Error loading retro from localStorage:', error);
    return null;
  }
}

/**
 * Save current retrospective session to localStorage.
 */
export function saveCurrentRetro(retro: RetroSession): void {
  try {
    const payload = {
      ...retro,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(payload));

    // Also update history list
    const history = loadRetroHistory();
    const existingIndex = history.findIndex((h) => h.id === retro.id);
    if (existingIndex >= 0) {
      history[existingIndex] = payload;
    } else {
      history.unshift(payload);
    }
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 15)));
  } catch (error) {
    console.error('Error saving retro to localStorage:', error);
  }
}

/**
 * Load list of previous retrospectives.
 */
export function loadRetroHistory(): RetroSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as RetroSession[];
  } catch {
    return [];
  }
}

/**
 * Delete a specific retro from history.
 */
export function deleteRetroFromHistory(id: string): void {
  try {
    const history = loadRetroHistory().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    const current = loadCurrentRetro();
    if (current && current.id === id) {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    }
  } catch (e) {
    console.error('Failed to delete retro:', e);
  }
}

/**
 * Clear the current retrospective.
 */
export function clearCurrentRetro(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  } catch (e) {
    console.error('Failed to clear current retro:', e);
  }
}

/**
 * Format retrospective as markdown for copying / exporting.
 */
export function formatRetroAsMarkdown(retro: RetroSession): string {
  const lines: string[] = [];
  lines.push(`# Retrospectiva — ${retro.sprintName}`);
  lines.push(`**Equipo:** ${retro.team}  |  **Fecha:** ${retro.date}  |  **Dinámica:** ${retro.method}`);
  lines.push('');

  let totalCards = 0;
  let totalVotes = 0;
  retro.columns.forEach((col) => {
    totalCards += col.cards.length;
    col.cards.forEach((c) => (totalVotes += c.votes || 0));
  });

  lines.push(`### Métricas:`);
  lines.push(`- 💡 Ideas compartidas: ${totalCards}`);
  lines.push(`- 👍 Total de votos: ${totalVotes}`);
  lines.push(`- ✅ Acciones definidas: ${retro.actions.length}`);
  lines.push('');

  lines.push(`## Tablero de Ideas`);
  retro.columns.forEach((col) => {
    lines.push(`### ${col.title} (${col.cards.length})`);
    if (col.cards.length === 0) {
      lines.push('_Sin tarjetas en esta columna_');
    } else {
      col.cards.forEach((card) => {
        const authorStr = card.author ? ` *(por ${card.author})*` : '';
        lines.push(`- [👍 ${card.votes}] ${card.text}${authorStr}`);
      });
    }
    lines.push('');
  });

  lines.push(`## Plan de Acciones (${retro.actions.length})`);
  if (retro.actions.length === 0) {
    lines.push('_No se registraron acciones acordadas._');
  } else {
    retro.actions.forEach((act, idx) => {
      const statusMap = {
        pending: '⏳ Pendiente',
        in_progress: '⚡ En progreso',
        completed: '✅ Completada'
      };
      lines.push(`${idx + 1}. **${act.description}**`);
      lines.push(`   - Responsable: ${act.assignee || 'Sin asignar'}`);
      lines.push(`   - Fecha límite: ${act.dueDate || 'Sin fecha'}`);
      lines.push(`   - Estado: ${statusMap[act.status] || act.status}`);
    });
  }

  return lines.join('\n');
}
