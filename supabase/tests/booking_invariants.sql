-- STAGING/CI database invariant checks.
-- Run after migrations on a disposable test database.

do $$
begin
 if not exists(
  select 1 from pg_constraint where conname='appointments_no_overlap'
 ) then raise exception 'appointments_no_overlap missing'; end if;

 if not exists(
  select 1 from pg_constraint where conname='time_blocks_no_overlap'
 ) then raise exception 'time_blocks_no_overlap missing'; end if;

 if not exists(
  select 1 from pg_proc where proname='book_appointment'
 ) then raise exception 'book_appointment missing'; end if;

 if not exists(
  select 1 from pg_proc where proname='reschedule_appointment'
 ) then raise exception 'reschedule_appointment missing'; end if;
end $$;
