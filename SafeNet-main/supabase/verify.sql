-- Run in SQL Editor after schema.sql and seed.sql; no secret data returned.
select 'scenarios' as table_name,count(*) as rows from public.scenarios
union all select 'choices',count(*) from public.choices
union all select 'attempts',count(*) from public.attempts;
-- Expect 3 scenarios, 9 choices; attempts appear after playing in live mode.
select table_name,column_name,data_type,is_nullable
from information_schema.columns
where table_schema='public' and table_name in ('scenarios','choices','attempts')
order by table_name,ordinal_position;
select tablename,policyname,cmd,roles,qual from pg_policies
where schemaname='public' and tablename in ('scenarios','choices','attempts');
select tc.table_name,kcu.column_name,ccu.table_name as referenced_table,ccu.column_name as referenced_column
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu on tc.constraint_name=kcu.constraint_name and tc.constraint_schema=kcu.constraint_schema
join information_schema.constraint_column_usage ccu on ccu.constraint_name=tc.constraint_name and ccu.constraint_schema=tc.constraint_schema
where tc.constraint_type='FOREIGN KEY' and tc.table_schema='public';
