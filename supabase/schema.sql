-- RetroSprint — esquema de Supabase
-- Ejecutar una vez en: Supabase Dashboard → SQL Editor → New query → Run.
--
-- Modelo de acceso: quien tiene el link (UUID de la retro) puede leer y editar.
-- No hay login; el UUID no es adivinable.

create table if not exists public.retros (
  id          text primary key,
  sprint_name text not null,
  date        text not null,
  team        text not null default '',
  method      text not null,
  columns     jsonb not null default '[]'::jsonb, -- [{id, title, description}]
  completed   boolean not null default false,
  created_at  bigint not null,
  updated_at  bigint not null
);

-- retro_id forma parte de la PK en las tablas hijas para que los eventos DELETE
-- de Realtime lo incluyan (con RLS activo, el "old record" solo trae la PK).
create table if not exists public.cards (
  retro_id   text not null references public.retros(id) on delete cascade,
  id         text not null,
  column_id  text not null,
  text       text not null,
  author     text,
  created_at bigint not null,
  primary key (retro_id, id)
);

create table if not exists public.votes (
  retro_id text not null,
  card_id  text not null,
  voter_id text not null,
  primary key (retro_id, card_id, voter_id),
  foreign key (retro_id, card_id) references public.cards(retro_id, id) on delete cascade
);

create table if not exists public.actions (
  retro_id         text not null references public.retros(id) on delete cascade,
  id               text not null,
  description      text not null,
  assignee         text not null default '',
  due_date         text not null default '',
  status           text not null default 'pending'
                   check (status in ('pending', 'in_progress', 'completed')),
  source_card_id   text,
  source_card_text text,
  created_at       bigint not null,
  primary key (retro_id, id)
);

-- RLS: acceso abierto para la clave pública (anon). La "llave" es el link.
alter table public.retros  enable row level security;
alter table public.cards   enable row level security;
alter table public.votes   enable row level security;
alter table public.actions enable row level security;

drop policy if exists "public access" on public.retros;
drop policy if exists "public access" on public.cards;
drop policy if exists "public access" on public.votes;
drop policy if exists "public access" on public.actions;

create policy "public access" on public.retros  for all to anon, authenticated using (true) with check (true);
create policy "public access" on public.cards   for all to anon, authenticated using (true) with check (true);
create policy "public access" on public.votes   for all to anon, authenticated using (true) with check (true);
create policy "public access" on public.actions for all to anon, authenticated using (true) with check (true);

-- Realtime
alter table public.retros  replica identity full;
alter table public.cards   replica identity full;
alter table public.votes   replica identity full;
alter table public.actions replica identity full;

do $$
declare t text;
begin
  foreach t in array array['retros', 'cards', 'votes', 'actions'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
