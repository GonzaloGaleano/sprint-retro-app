import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RetroSession, RetroCard, ActionItem, SortOrder } from '../types';
import {
  getVoterId,
  loadCurrentRetro,
  saveCurrentRetro,
  loadRetroHistory,
  clearCurrentRetro,
  deleteRetroFromHistory
} from '../utils/storage';
import * as remote from '../utils/remoteRetro';
import { isSupabaseConfigured } from '../lib/supabase';
import { createEmptyColumnsForMethod, getSampleRetroSession } from '../data/retroMethods';

export type SyncStatus = 'local' | 'loading' | 'synced' | 'not_found' | 'error';

const URL_PARAM = 'retro';

function getRetroIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(URL_PARAM);
}

function setRetroIdInUrl(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(URL_PARAM, id);
  else url.searchParams.delete(URL_PARAM);
  window.history.replaceState(null, '', url.toString());
}

export function getShareUrl(retroId: string): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set(URL_PARAM, retroId);
  return url.toString();
}

/**
 * Initial session: the retro linked in the URL (using any local snapshot while it loads),
 * otherwise the last retro opened in this browser.
 */
function getInitialRetro(): RetroSession | null {
  const urlId = getRetroIdFromUrl();
  const current = loadCurrentRetro();
  if (!urlId) return current;
  if (current?.id === urlId) return current;
  return loadRetroHistory().find((r) => r.id === urlId) ?? null;
}

export function useRetro() {
  const [retro, setRetro] = useState<RetroSession | null>(getInitialRetro);
  const [activeId, setActiveId] = useState<string | null>(() => getRetroIdFromUrl() ?? retro?.id ?? null);
  const [voterId] = useState<string>(() => getVoterId());
  const [sortOrder, setSortOrder] = useState<SortOrder>('most_voted');
  const [history, setHistory] = useState<RetroSession[]>(() => loadRetroHistory());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isSupabaseConfigured ? 'loading' : 'local');
  const [syncError, setSyncError] = useState<string | null>(null);

  const retroRef = useRef(retro);
  retroRef.current = retro;
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  // Inserts in flight for freshly created retros, so the loader doesn't race them.
  const pendingInserts = useRef(new Map<string, Promise<void>>());

  // Keep a local snapshot for the "saved in this browser" history list
  useEffect(() => {
    if (retro) {
      saveCurrentRetro(retro);
      setHistory(loadRetroHistory());
    }
  }, [retro]);

  const refresh = useCallback(async (id: string) => {
    try {
      const fresh = await remote.fetchRetro(id);
      if (activeIdRef.current !== id) return;
      if (fresh) {
        setRetro(fresh);
        setSyncStatus('synced');
        setSyncError(null);
      }
      return fresh;
    } catch (err) {
      console.error('Error loading retro from Supabase:', err);
      if (activeIdRef.current === id) {
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : String(err));
      }
    }
  }, []);

  // Load the active retro from Supabase and subscribe to realtime changes
  useEffect(() => {
    if (!activeId) {
      setRetroIdInUrl(null);
      return;
    }
    setRetroIdInUrl(activeId);
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    setSyncStatus('loading');

    (async () => {
      await pendingInserts.current.get(activeId)?.catch(() => undefined);
      if (cancelled) return;
      const fresh = await refresh(activeId);
      if (cancelled || fresh !== null) return;

      // Not on the server: upload it if this browser has a local copy (retros created before sync existed)
      const local = retroRef.current;
      if (local?.id === activeId) {
        try {
          await remote.insertRetro(local);
          if (!cancelled) await refresh(activeId);
        } catch (err) {
          console.error('Error uploading local retro:', err);
          if (!cancelled) {
            setSyncStatus('error');
            setSyncError(err instanceof Error ? err.message : String(err));
          }
        }
      } else {
        setSyncStatus('not_found');
      }
    })();

    const unsubscribe = remote.subscribeToRetro(activeId, () => {
      if (!pendingInserts.current.has(activeId)) refresh(activeId);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [activeId, refresh]);

  /**
   * Fire a remote write. Local state was already updated optimistically;
   * on failure, reload the authoritative state from the server.
   */
  const persist = useCallback(
    (write: (retroId: string) => Promise<void>) => {
      const id = activeIdRef.current;
      if (!isSupabaseConfigured || !id) return;
      const pending = pendingInserts.current.get(id) ?? Promise.resolve();
      pending
        .then(() => write(id))
        .catch((err) => {
          console.error('Error saving to Supabase:', err);
          setSyncError(err instanceof Error ? err.message : String(err));
          refresh(id);
        });
    },
    [refresh]
  );

  const openNewSession = useCallback((session: RetroSession) => {
    if (isSupabaseConfigured) {
      const insert = remote.insertRetro(session).finally(() => {
        pendingInserts.current.delete(session.id);
      });
      pendingInserts.current.set(session.id, insert);
      insert.catch((err) => {
        console.error('Error creating retro in Supabase:', err);
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : String(err));
      });
    }
    setRetro(session);
    setActiveId(session.id);
  }, []);

  const refreshHistory = useCallback(() => {
    setHistory(loadRetroHistory());
  }, []);

  const createNewRetro = useCallback(
    (params: { sprintName: string; date: string; team: string; method: string }) => {
      const newSession: RetroSession = {
        id: remote.generateId(),
        sprintName: params.sprintName.trim(),
        date: params.date,
        team: params.team.trim(),
        method: params.method,
        columns: createEmptyColumnsForMethod(params.method),
        actions: [],
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      openNewSession(newSession);
      return newSession;
    },
    [openNewSession]
  );

  const loadRetro = useCallback((selectedRetro: RetroSession) => {
    setRetro(selectedRetro);
    setActiveId(selectedRetro.id);
  }, []);

  const loadSample = useCallback(
    (methodId: string = 'start-stop-continue') => {
      const sample = getSampleRetroSession(voterId, methodId);
      // Each demo gets its own id so it can be shared without colliding with other demos
      openNewSession({ ...sample, id: remote.generateId() });
    },
    [voterId, openNewSession]
  );

  const changeMethod = useCallback(
    (newMethodId: string) => {
      const prev = retroRef.current;
      if (!prev) return;
      const targetColumns = createEmptyColumnsForMethod(newMethodId);

      // Distribute any existing cards gracefully across the new columns
      // by index so users don't lose ideas
      const allExistingCards = prev.columns.flatMap((col) => col.cards);
      if (allExistingCards.length > 0 && targetColumns.length > 0) {
        allExistingCards.forEach((card, index) => {
          const targetColIndex = index % targetColumns.length;
          targetColumns[targetColIndex].cards.push(card);
        });
      }

      setRetro({
        ...prev,
        method: newMethodId,
        columns: targetColumns,
        updatedAt: Date.now()
      });
      persist((id) => remote.changeRetroMethod(id, newMethodId, targetColumns));
    },
    [persist]
  );

  const addCard = useCallback(
    (columnId: string, text: string, author?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const newCard: RetroCard = {
        id: 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        text: trimmed,
        author: author?.trim() || undefined,
        votes: 0,
        voters: [],
        createdAt: Date.now()
      };

      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: [newCard, ...col.cards]
            };
          }
          return col;
        });

        return {
          ...prev,
          columns: nextColumns,
          updatedAt: Date.now()
        };
      });
      persist((id) => remote.insertCard(id, columnId, newCard));
    },
    [persist]
  );

  const updateCard = useCallback(
    (columnId: string, cardId: string, text: string, author?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const nextAuthor = author?.trim() || undefined;

      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId
                  ? { ...c, text: trimmed, author: nextAuthor }
                  : c
              )
            };
          }
          return col;
        });

        return { ...prev, columns: nextColumns, updatedAt: Date.now() };
      });
      persist((id) => remote.updateCardText(id, cardId, trimmed, nextAuthor));
    },
    [persist]
  );

  const deleteCard = useCallback(
    (columnId: string, cardId: string) => {
      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== cardId)
            };
          }
          return col;
        });

        return { ...prev, columns: nextColumns, updatedAt: Date.now() };
      });
      persist((id) => remote.deleteCard(id, cardId));
    },
    [persist]
  );

  const toggleVote = useCallback(
    (columnId: string, cardId: string) => {
      const card = retroRef.current?.columns
        .find((col) => col.id === columnId)
        ?.cards.find((c) => c.id === cardId);
      if (!card) return;
      const hasVoted = card.voters?.includes(voterId) ?? false;

      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.map((c) => {
                if (c.id !== cardId) return c;
                const voters = (c.voters ?? []).filter((v) => v !== voterId);
                if (!hasVoted) voters.push(voterId);
                return { ...c, votes: voters.length, voters };
              })
            };
          }
          return col;
        });

        return { ...prev, columns: nextColumns, updatedAt: Date.now() };
      });
      persist((id) =>
        hasVoted ? remote.removeVote(id, cardId, voterId) : remote.addVote(id, cardId, voterId)
      );
    },
    [voterId, persist]
  );

  const addAction = useCallback(
    (data: {
      description: string;
      assignee: string;
      dueDate: string;
      sourceCardId?: string;
      sourceCardText?: string;
    }) => {
      const newAction: ActionItem = {
        id: 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        description: data.description.trim(),
        assignee: data.assignee.trim(),
        dueDate: data.dueDate,
        status: 'pending',
        createdAt: Date.now(),
        sourceCardId: data.sourceCardId,
        sourceCardText: data.sourceCardText
      };

      setRetro((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          actions: [newAction, ...prev.actions],
          updatedAt: Date.now()
        };
      });
      persist((id) => remote.insertAction(id, newAction));
    },
    [persist]
  );

  const updateAction = useCallback(
    (actionId: string, updates: Partial<ActionItem>) => {
      const existing = retroRef.current?.actions.find((act) => act.id === actionId);
      if (!existing) return;
      const merged = { ...existing, ...updates };

      setRetro((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          actions: prev.actions.map((act) => (act.id === actionId ? { ...act, ...updates } : act)),
          updatedAt: Date.now()
        };
      });
      persist((id) => remote.updateAction(id, merged));
    },
    [persist]
  );

  const deleteAction = useCallback(
    (actionId: string) => {
      setRetro((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          actions: prev.actions.filter((act) => act.id !== actionId),
          updatedAt: Date.now()
        };
      });
      persist((id) => remote.deleteAction(id, actionId));
    },
    [persist]
  );

  const setCompleted = useCallback(
    (completed: boolean) => {
      setRetro((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          completed,
          updatedAt: Date.now()
        };
      });
      persist((id) => remote.setRetroCompleted(id, completed));
    },
    [persist]
  );

  const resetCurrent = useCallback(() => {
    clearCurrentRetro();
    setRetro(null);
    setActiveId(null);
    setHistory(loadRetroHistory());
  }, []);

  // Only removes the local snapshot; the shared retro stays available to others via its link
  const deleteSavedRetro = useCallback((id: string) => {
    deleteRetroFromHistory(id);
    setHistory(loadRetroHistory());
  }, []);

  // Top 3 most voted cards calculation
  const topVotedCards = useMemo(() => {
    if (!retro) return [];
    const allCards: Array<{
      card: RetroCard;
      columnTitle: string;
      columnId: string;
    }> = [];

    retro.columns.forEach((col) => {
      col.cards.forEach((card) => {
        allCards.push({
          card,
          columnTitle: col.title,
          columnId: col.id
        });
      });
    });

    // Sort by votes descending, then by creation date
    allCards.sort((a, b) => {
      if (b.card.votes !== a.card.votes) {
        return b.card.votes - a.card.votes;
      }
      return b.card.createdAt - a.card.createdAt;
    });

    return allCards.slice(0, 3);
  }, [retro]);

  // Overall statistics
  const stats = useMemo(() => {
    if (!retro) return { totalCards: 0, totalVotes: 0, totalActions: 0, completedActions: 0 };
    let totalCards = 0;
    let totalVotes = 0;
    retro.columns.forEach((col) => {
      totalCards += col.cards.length;
      col.cards.forEach((c) => {
        totalVotes += c.votes || 0;
      });
    });
    const completedActions = retro.actions.filter((a) => a.status === 'completed').length;
    return {
      totalCards,
      totalVotes,
      totalActions: retro.actions.length,
      completedActions
    };
  }, [retro]);

  return {
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
    refreshHistory,
    topVotedCards,
    stats
  };
}
