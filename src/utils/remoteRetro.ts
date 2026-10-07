import { supabase } from '../lib/supabase';
import { RetroSession, RetroCard, RetroColumn, ActionItem } from '../types';

/**
 * Supabase persistence for shared retrospectives.
 * Every mutation is a granular write so concurrent participants never overwrite each other.
 */

type ColumnDef = Omit<RetroColumn, 'cards'>;

interface RetroRow {
  id: string;
  sprint_name: string;
  date: string;
  team: string;
  method: string;
  columns: ColumnDef[];
  completed: boolean;
  created_at: number;
  updated_at: number;
}

interface CardRow {
  retro_id: string;
  id: string;
  column_id: string;
  text: string;
  author: string | null;
  created_at: number;
}

interface VoteRow {
  retro_id: string;
  card_id: string;
  voter_id: string;
}

interface ActionRow {
  retro_id: string;
  id: string;
  description: string;
  assignee: string;
  due_date: string;
  status: ActionItem['status'];
  source_card_id: string | null;
  source_card_text: string | null;
  created_at: number;
}

function db() {
  if (!supabase) throw new Error('Supabase no está configurado');
  return supabase;
}

function check<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

/**
 * Random id that also works outside secure contexts (e.g. dev server over LAN IP).
 */
export function generateId(prefix = ''): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return prefix + crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return prefix + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function toColumnDefs(columns: RetroColumn[]): ColumnDef[] {
  return columns.map(({ id, title, description }) => ({ id, title, description }));
}

function cardToRow(retroId: string, columnId: string, card: RetroCard): CardRow {
  return {
    retro_id: retroId,
    id: card.id,
    column_id: columnId,
    text: card.text,
    author: card.author ?? null,
    created_at: card.createdAt
  };
}

function actionToRow(retroId: string, action: ActionItem): ActionRow {
  return {
    retro_id: retroId,
    id: action.id,
    description: action.description,
    assignee: action.assignee,
    due_date: action.dueDate,
    status: action.status,
    source_card_id: action.sourceCardId ?? null,
    source_card_text: action.sourceCardText ?? null,
    created_at: action.createdAt
  };
}

/**
 * Load a full retrospective (columns, cards, votes, actions). Returns null if it doesn't exist.
 */
export async function fetchRetro(id: string): Promise<RetroSession | null> {
  const client = db();
  const [retroRes, cardsRes, votesRes, actionsRes] = await Promise.all([
    client.from('retros').select('*').eq('id', id).maybeSingle(),
    client.from('cards').select('*').eq('retro_id', id).order('created_at', { ascending: false }),
    client.from('votes').select('*').eq('retro_id', id),
    client.from('actions').select('*').eq('retro_id', id).order('created_at', { ascending: false })
  ]);

  const row = check(retroRes) as RetroRow | null;
  if (!row) return null;
  const cards = check(cardsRes) as CardRow[];
  const votes = check(votesRes) as VoteRow[];
  const actions = check(actionsRes) as ActionRow[];

  const votersByCard = new Map<string, string[]>();
  votes.forEach((v) => {
    const list = votersByCard.get(v.card_id) ?? [];
    list.push(v.voter_id);
    votersByCard.set(v.card_id, list);
  });

  const columns: RetroColumn[] = row.columns.map((col) => ({ ...col, cards: [] }));
  cards.forEach((c) => {
    const voters = votersByCard.get(c.id) ?? [];
    const card: RetroCard = {
      id: c.id,
      text: c.text,
      author: c.author ?? undefined,
      votes: voters.length,
      voters,
      createdAt: c.created_at
    };
    const target = columns.find((col) => col.id === c.column_id) ?? columns[0];
    target?.cards.push(card);
  });

  return {
    id: row.id,
    sprintName: row.sprint_name,
    date: row.date,
    team: row.team,
    method: row.method,
    columns,
    actions: actions.map((a) => ({
      id: a.id,
      description: a.description,
      assignee: a.assignee,
      dueDate: a.due_date,
      status: a.status,
      createdAt: a.created_at,
      sourceCardId: a.source_card_id ?? undefined,
      sourceCardText: a.source_card_text ?? undefined
    })),
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Insert a complete retrospective (used for new retros, demo data and migrating local-only retros).
 */
export async function insertRetro(retro: RetroSession): Promise<void> {
  const client = db();
  const now = Date.now();
  check(
    await client.from('retros').insert({
      id: retro.id,
      sprint_name: retro.sprintName,
      date: retro.date,
      team: retro.team,
      method: retro.method,
      columns: toColumnDefs(retro.columns),
      completed: retro.completed ?? false,
      created_at: retro.createdAt ?? now,
      updated_at: retro.updatedAt ?? now
    })
  );

  const cardRows = retro.columns.flatMap((col) => col.cards.map((c) => cardToRow(retro.id, col.id, c)));
  if (cardRows.length > 0) check(await client.from('cards').insert(cardRows));

  const voteRows: VoteRow[] = retro.columns.flatMap((col) =>
    col.cards.flatMap((c) =>
      Array.from(new Set(c.voters ?? [])).map((voter_id) => ({ retro_id: retro.id, card_id: c.id, voter_id }))
    )
  );
  if (voteRows.length > 0) check(await client.from('votes').insert(voteRows));

  if (retro.actions.length > 0) {
    check(await client.from('actions').insert(retro.actions.map((a) => actionToRow(retro.id, a))));
  }
}

async function touchRetro(retroId: string, patch: Partial<RetroRow> = {}): Promise<void> {
  check(await db().from('retros').update({ ...patch, updated_at: Date.now() }).eq('id', retroId));
}

export async function setRetroCompleted(retroId: string, completed: boolean): Promise<void> {
  await touchRetro(retroId, { completed });
}

/**
 * Switch the board method: replace column definitions and reassign cards to new columns.
 */
export async function changeRetroMethod(
  retroId: string,
  method: string,
  columns: RetroColumn[]
): Promise<void> {
  await touchRetro(retroId, { method, columns: toColumnDefs(columns) });
  const cardRows = columns.flatMap((col) => col.cards.map((c) => cardToRow(retroId, col.id, c)));
  if (cardRows.length > 0) check(await db().from('cards').upsert(cardRows));
}

export async function insertCard(retroId: string, columnId: string, card: RetroCard): Promise<void> {
  check(await db().from('cards').insert(cardToRow(retroId, columnId, card)));
}

export async function updateCardText(
  retroId: string,
  cardId: string,
  text: string,
  author?: string
): Promise<void> {
  check(
    await db()
      .from('cards')
      .update({ text, author: author ?? null })
      .eq('retro_id', retroId)
      .eq('id', cardId)
  );
}

export async function deleteCard(retroId: string, cardId: string): Promise<void> {
  check(await db().from('cards').delete().eq('retro_id', retroId).eq('id', cardId));
}

export async function addVote(retroId: string, cardId: string, voterId: string): Promise<void> {
  check(
    await db()
      .from('votes')
      .upsert({ retro_id: retroId, card_id: cardId, voter_id: voterId }, { ignoreDuplicates: true })
  );
}

export async function removeVote(retroId: string, cardId: string, voterId: string): Promise<void> {
  check(
    await db()
      .from('votes')
      .delete()
      .eq('retro_id', retroId)
      .eq('card_id', cardId)
      .eq('voter_id', voterId)
  );
}

export async function insertAction(retroId: string, action: ActionItem): Promise<void> {
  check(await db().from('actions').insert(actionToRow(retroId, action)));
}

export async function updateAction(retroId: string, action: ActionItem): Promise<void> {
  const { retro_id, id, ...fields } = actionToRow(retroId, action);
  check(await db().from('actions').update(fields).eq('retro_id', retro_id).eq('id', id));
}

export async function deleteAction(retroId: string, actionId: string): Promise<void> {
  check(await db().from('actions').delete().eq('retro_id', retroId).eq('id', actionId));
}

/**
 * Subscribe to any change in a retrospective. Calls onChange (debounced) whenever
 * another participant (or this one) modifies it, and once more after (re)connecting.
 */
export function subscribeToRetro(retroId: string, onChange: () => void): () => void {
  const client = db();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(onChange, 120);
  };

  const channel = client.channel(`retro:${retroId}`);

  channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'retros', filter: `id=eq.${retroId}` }, trigger);

  (['cards', 'votes', 'actions'] as const).forEach((table) => {
    const filter = `retro_id=eq.${retroId}`;
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table, filter }, trigger);
    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table, filter }, trigger);
    // DELETE events can't be filtered server-side; retro_id is part of the PK so it's present in `old`.
    channel.on('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload) => {
      if ((payload.old as { retro_id?: string })?.retro_id === retroId) trigger();
    });
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') trigger();
  });

  return () => {
    clearTimeout(timer);
    client.removeChannel(channel);
  };
}
