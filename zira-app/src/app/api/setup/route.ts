import { NextRequest, NextResponse } from "next/server";

const PROJECT_REF = "tuawhoriebnnqtrddaai";
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

/* Full database schema */
const SCHEMA_SQL = `
-- ── Profiles ──────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  username        text unique,
  avatar_url      text,
  bio             text,
  coins           integer not null default 0,
  streak          integer not null default 0,
  last_study_date date,
  total_study_minutes integer not null default 0,
  subscription    text not null default 'free' check (subscription in ('free','premium')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Challenges ────────────────────────────────────────────────────
create table if not exists public.challenges (
  id                   uuid primary key default gen_random_uuid(),
  title_ar             text not null,
  description_ar       text,
  requirement_minutes  integer not null default 60,
  reward_coins         integer not null default 50,
  icon                 text default '🎯',
  is_active            boolean not null default true,
  created_at           timestamptz not null default now()
);

create table if not exists public.user_challenges (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  challenge_id      uuid not null references public.challenges(id) on delete cascade,
  progress_minutes  integer not null default 0,
  completed         boolean not null default false,
  completed_at      timestamptz,
  assigned_at       timestamptz not null default now(),
  unique(user_id, challenge_id)
);

-- ── Achievements ──────────────────────────────────────────────────
create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  name_ar     text not null,
  description_ar text,
  icon        text not null default '⭐',
  badge       text not null default 'bronze' check (badge in ('bronze','silver','gold')),
  requirement_type text,
  requirement_value integer,
  created_at  timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  unique(user_id, achievement_id)
);

-- ── Study Sessions ────────────────────────────────────────────────
create table if not exists public.study_sessions (
  id            uuid primary key default gen_random_uuid(),
  host_id       uuid not null references public.profiles(id) on delete cascade,
  code          text unique not null,
  subject       text,
  is_active     boolean not null default true,
  started_at    timestamptz not null default now(),
  ended_at      timestamptz
);

create table if not exists public.session_participants (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.study_sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  unique(session_id, user_id)
);

-- ── Flashcards ────────────────────────────────────────────────────
create table if not exists public.flashcard_sets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  subject     text,
  card_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.flashcards (
  id          uuid primary key default gen_random_uuid(),
  set_id      uuid not null references public.flashcard_sets(id) on delete cascade,
  front       text not null,
  back        text not null,
  difficulty  integer default 3 check (difficulty between 1 and 5),
  created_at  timestamptz not null default now()
);

-- ── Farm / Shop ───────────────────────────────────────────────────
create table if not exists public.farm_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  item_id     text not null,
  item_name   text not null,
  item_type   text not null,
  rarity      text not null default 'common',
  position_x  integer default 0,
  position_y  integer default 0,
  purchased_at timestamptz not null default now()
);

-- ── Timer Sessions ────────────────────────────────────────────────
create table if not exists public.timer_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  duration_mins integer not null,
  coins_earned  integer not null default 0,
  completed     boolean not null default true,
  started_at    timestamptz not null default now()
);

-- ── Enable RLS ────────────────────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.user_challenges      enable row level security;
alter table public.user_achievements    enable row level security;
alter table public.study_sessions       enable row level security;
alter table public.session_participants enable row level security;
alter table public.flashcard_sets       enable row level security;
alter table public.flashcards           enable row level security;
alter table public.farm_items           enable row level security;
alter table public.timer_sessions       enable row level security;

-- ── RLS Policies ─────────────────────────────────────────────────
-- Profiles: public read, owner write
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Challenges: public read
drop policy if exists "challenges_select" on public.challenges;
create policy "challenges_select" on public.challenges for select using (true);

-- Achievements: public read
drop policy if exists "achievements_select" on public.achievements;
create policy "achievements_select" on public.achievements for select using (true);

-- User challenges: owner only
drop policy if exists "user_challenges_all" on public.user_challenges;
create policy "user_challenges_all" on public.user_challenges using (auth.uid() = user_id);

-- User achievements: owner only
drop policy if exists "user_achievements_all" on public.user_achievements;
create policy "user_achievements_all" on public.user_achievements using (auth.uid() = user_id);

-- Sessions: any authenticated
drop policy if exists "sessions_select" on public.study_sessions;
drop policy if exists "sessions_insert" on public.study_sessions;
drop policy if exists "sessions_update" on public.study_sessions;
create policy "sessions_select" on public.study_sessions for select using (true);
create policy "sessions_insert" on public.study_sessions for insert with check (auth.uid() = host_id);
create policy "sessions_update" on public.study_sessions for update using (auth.uid() = host_id);

-- Session participants
drop policy if exists "participants_all" on public.session_participants;
create policy "participants_all" on public.session_participants using (true) with check (auth.uid() = user_id);

-- Flashcards
drop policy if exists "flashcard_sets_all" on public.flashcard_sets;
drop policy if exists "flashcards_all" on public.flashcards;
create policy "flashcard_sets_all" on public.flashcard_sets using (auth.uid() = user_id);
create policy "flashcards_all" on public.flashcards using (
  exists (select 1 from public.flashcard_sets s where s.id = set_id and s.user_id = auth.uid())
);

-- Farm
drop policy if exists "farm_items_all" on public.farm_items;
create policy "farm_items_all" on public.farm_items using (auth.uid() = user_id);

-- Timer sessions
drop policy if exists "timer_sessions_all" on public.timer_sessions;
create policy "timer_sessions_all" on public.timer_sessions using (auth.uid() = user_id);

-- ── Auto-create profile on signup ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, coins, streak, total_study_minutes, subscription)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    0, 0, 0, 'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Seed: Challenges ─────────────────────────────────────────────
insert into public.challenges (title_ar, description_ar, requirement_minutes, reward_coins, icon) values
  ('أكمل ساعة دراسة', 'ادرس لمدة 60 دقيقة متواصلة', 60, 50, '⏱️'),
  ('يوم كامل من التركيز', 'ادرس لمدة 120 دقيقة في يوم واحد', 120, 120, '🔥'),
  ('أسبوع الانجاز', 'ادرس 7 أيام متتالية', 420, 300, '🏆'),
  ('الطالب المثالي', 'اكمل 5 ساعات دراسة هذا الأسبوع', 300, 200, '⭐'),
  ('جلسة التركيز', 'ادرس 45 دقيقة بدون انقطاع', 45, 40, '🎯')
on conflict do nothing;

-- ── Seed: Achievements ───────────────────────────────────────────
insert into public.achievements (name_ar, description_ar, icon, badge, requirement_type, requirement_value) values
  ('المبتدئ', 'أكملت أول جلسة دراسة', '🌱', 'bronze', 'sessions', 1),
  ('الدارس المستمر', 'ادرست 7 أيام متتالية', '🔥', 'silver', 'streak', 7),
  ('الأسطورة', 'ادرست 100 ساعة', '👑', 'gold', 'hours', 100),
  ('المتصدر', 'وصلت للمركز الأول', '🏆', 'gold', 'rank', 1),
  ('الباحث', 'أنشأت 10 مجموعات بطاقات', '📚', 'silver', 'flashcard_sets', 10)
on conflict do nothing;
`;

export async function POST(req: NextRequest) {
  try {
    const { serviceRoleKey, managementToken } = await req.json();

    if (!serviceRoleKey && !managementToken) {
      return NextResponse.json({ error: "Provide serviceRoleKey or managementToken" }, { status: 400 });
    }

    const steps: { step: string; ok: boolean; msg: string }[] = [];

    /* ── Step 1: Run SQL via Management API ── */
    if (managementToken) {
      const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${managementToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: SCHEMA_SQL }),
      });

      const data = await res.json();
      if (!res.ok) {
        steps.push({ step: "Create schema", ok: false, msg: data.message ?? JSON.stringify(data) });
      } else {
        steps.push({ step: "Create schema (all tables + RLS + triggers + seed)", ok: true, msg: "Done" });
      }
    }

    /* ── Step 2: Disable email confirmation via Admin API ── */
    if (serviceRoleKey) {
      const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/config`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "apikey": serviceRoleKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailer_autoconfirm: true,
          enable_signup: true,
        }),
      });

      if (authRes.ok) {
        steps.push({ step: "Disable email confirmation", ok: true, msg: "Signups now instant — no email needed" });
      } else {
        const body = await authRes.text();
        steps.push({ step: "Disable email confirmation", ok: false, msg: body });
      }
    }

    return NextResponse.json({ steps });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
