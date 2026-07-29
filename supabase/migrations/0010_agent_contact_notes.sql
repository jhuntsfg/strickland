-- lib/types.ts and the agent create/edit API routes have referenced these
-- columns since early on, but no migration ever added them to `agents`.
alter table agents add column if not exists phone text;
alter table agents add column if not exists email text;
alter table agents add column if not exists state text;
alter table agents add column if not exists notes text;
