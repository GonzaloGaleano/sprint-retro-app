import { useState, useEffect, useCallback, useMemo } from 'react';
import { RetroSession, RetroCard, ActionItem, SortOrder } from '../types';
import {
  getVoterId,
  loadCurrentRetro,
  saveCurrentRetro,
  loadRetroHistory,
  clearCurrentRetro,
  deleteRetroFromHistory
} from '../utils/storage';
import { createEmptyColumnsForMethod, getSampleRetroSession } from '../data/retroMethods';

export function useRetro() {
  const [retro, setRetro] = useState<RetroSession | null>(() => loadCurrentRetro());
  const [voterId] = useState<string>(() => getVoterId());
  const [sortOrder, setSortOrder] = useState<SortOrder>('most_voted');
  const [history, setHistory] = useState<RetroSession[]>(() => loadRetroHistory());

  // Save changes to localStorage whenever retro state changes
  useEffect(() => {
    if (retro) {
      saveCurrentRetro(retro);
      setHistory(loadRetroHistory());
    }
  }, [retro]);

  const refreshHistory = useCallback(() => {
    setHistory(loadRetroHistory());
  }, []);

  const createNewRetro = useCallback(
    (params: { sprintName: string; date: string; team: string; method: string }) => {
      const newSession: RetroSession = {
        id: 'retro_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
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
      setRetro(newSession);
      return newSession;
    },
    []
  );

  const loadRetro = useCallback((selectedRetro: RetroSession) => {
    setRetro(selectedRetro);
  }, []);

  const loadSample = useCallback((methodId: string = 'start-stop-continue') => {
    const sample = getSampleRetroSession(voterId, methodId);
    setRetro(sample);
  }, [voterId]);

  const changeMethod = useCallback((newMethodId: string) => {
    setRetro((prev) => {
      if (!prev) return prev;
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

      return {
        ...prev,
        method: newMethodId,
        columns: targetColumns,
        updatedAt: Date.now()
      };
    });
  }, []);

  const addCard = useCallback((columnId: string, text: string, author?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setRetro((prev) => {
      if (!prev) return prev;
      const newCard: RetroCard = {
        id: 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        text: trimmed,
        author: author?.trim() || undefined,
        votes: 0,
        voters: [],
        createdAt: Date.now()
      };

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
  }, []);

  const updateCard = useCallback(
    (columnId: string, cardId: string, text: string, author?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId
                  ? { ...c, text: trimmed, author: author?.trim() || undefined }
                  : c
              )
            };
          }
          return col;
        });

        return { ...prev, columns: nextColumns, updatedAt: Date.now() };
      });
    },
    []
  );

  const deleteCard = useCallback((columnId: string, cardId: string) => {
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
  }, []);

  const toggleVote = useCallback(
    (columnId: string, cardId: string) => {
      setRetro((prev) => {
        if (!prev) return prev;
        const nextColumns = prev.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.map((card) => {
                if (card.id === cardId) {
                  const hasVoted = card.voters?.includes(voterId);
                  const voters = card.voters ? [...card.voters] : [];
                  let nextVoters: string[];
                  let nextVotes: number;

                  if (hasVoted) {
                    // Remove vote
                    nextVoters = voters.filter((id) => id !== voterId);
                    nextVotes = Math.max(0, card.votes - 1);
                  } else {
                    // Add vote
                    nextVoters = [...voters, voterId];
                    nextVotes = card.votes + 1;
                  }

                  return {
                    ...card,
                    votes: nextVotes,
                    voters: nextVoters
                  };
                }
                return card;
              })
            };
          }
          return col;
        });

        return { ...prev, columns: nextColumns, updatedAt: Date.now() };
      });
    },
    [voterId]
  );

  const addAction = useCallback(
    (data: {
      description: string;
      assignee: string;
      dueDate: string;
      sourceCardId?: string;
      sourceCardText?: string;
    }) => {
      setRetro((prev) => {
        if (!prev) return prev;
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

        return {
          ...prev,
          actions: [newAction, ...prev.actions],
          updatedAt: Date.now()
        };
      });
    },
    []
  );

  const updateAction = useCallback((actionId: string, updates: Partial<ActionItem>) => {
    setRetro((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        actions: prev.actions.map((act) =>
          act.id === actionId ? { ...act, ...updates } : act
        ),
        updatedAt: Date.now()
      };
    });
  }, []);

  const deleteAction = useCallback((actionId: string) => {
    setRetro((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        actions: prev.actions.filter((act) => act.id !== actionId),
        updatedAt: Date.now()
      };
    });
  }, []);

  const setCompleted = useCallback((completed: boolean) => {
    setRetro((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        completed,
        updatedAt: Date.now()
      };
    });
  }, []);

  const resetCurrent = useCallback(() => {
    clearCurrentRetro();
    setRetro(null);
    setHistory(loadRetroHistory());
  }, []);

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
    voterId,
    sortOrder,
    setSortOrder,
    history,
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
