alter table profiles 
drop column email,
drop column contact,
drop column banned,
drop column listings,
drop column notifications,
drop column fcm_token;

alter table profiles 
drop column name;

alter table profiles 
drop column cover_url;

create function public.handle_user_upsert()
returns trigger
set search_path = ''
as $$
begin
  -- Insert a new profile or update the existing one
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) 
  do update set 
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for handling both insert and update events
create trigger on_auth_user_change
  after insert or update on auth.users
  for each row 
  execute procedure public.handle_user_upsert();


DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
drop function  IF EXISTS public.handle_new_user();