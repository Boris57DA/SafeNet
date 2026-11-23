-- Run once in a NEW Supabase project, before seed.sql.
begin;
create table public.scenarios (
  id integer primary key,
  category jsonb not null,
  title jsonb not null,
  description jsonb not null,
  sender text not null,
  message jsonb not null,
  fake_link text not null default '',
  difficulty_level smallint not null default 1 check (difficulty_level between 1 and 3),
  minutes smallint not null check (minutes > 0),
  icon text not null,
  created_at timestamptz not null default now()
);
create table public.choices (
  id integer primary key,
  scenario_id integer not null references public.scenarios(id) on delete cascade,
  position smallint not null check (position > 0),
  text jsonb not null,
  is_correct boolean not null,
  feedback jsonb not null,
  unique (scenario_id,position),
  unique (id,scenario_id)
);
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id integer not null references public.scenarios(id),
  choice_id integer not null,
  is_correct boolean not null,
  points_earned integer not null check (points_earned in (0,100)),
  feedback jsonb not null,
  attempted_at timestamptz not null default now(),
  foreign key (choice_id,scenario_id) references public.choices(id,scenario_id),
  unique (user_id,scenario_id)
);
alter table public.scenarios enable row level security;
alter table public.choices enable row level security;
alter table public.attempts enable row level security;

-- Explicit grants: answers/feedback cannot be read before submission.
revoke all on public.scenarios,public.choices,public.attempts from anon,authenticated;
grant select on public.scenarios to authenticated;
grant select (id,scenario_id,position,text) on public.choices to authenticated;
grant select on public.attempts to authenticated;
create policy "Read training scenarios" on public.scenarios for select to authenticated using (true);
create policy "Read choice labels" on public.choices for select to authenticated using (true);
create policy "Read own attempts" on public.attempts for select to authenticated using ((select auth.uid())=user_id);

-- No direct client INSERT/UPDATE: identity, grading and points are server controlled.
create function public.submit_answer(p_choice_id integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_choice public.choices%rowtype; v_attempt public.attempts%rowtype;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select * into v_choice from public.choices where id=p_choice_id;
  if not found then raise exception 'Unknown choice'; end if;
  insert into public.attempts(user_id,scenario_id,choice_id,is_correct,points_earned,feedback)
  values(v_user,v_choice.scenario_id,v_choice.id,v_choice.is_correct,case when v_choice.is_correct then 100 else 0 end,v_choice.feedback)
  on conflict (user_id,scenario_id) do nothing;
  select * into v_attempt from public.attempts where user_id=v_user and scenario_id=v_choice.scenario_id;
  return to_jsonb(v_attempt);
end;
$$;
revoke all on function public.submit_answer(integer) from public,anon;
grant execute on function public.submit_answer(integer) to authenticated;
commit;
