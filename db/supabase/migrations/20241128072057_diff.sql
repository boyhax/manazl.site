create extension if not exists "postgis" with schema "public" version '3.3.2';

drop policy "chats_id" on "public"."chats";

drop policy "Enable read access for all users" on "public"."reservations";

drop policy "chats_messages" on "public"."messages";

drop policy "Enable read access for all users" on "public"."notifications";

alter table "public"."chats" drop constraint "chats_user_id_fkey";

drop index if exists "public"."chats_unique__users_index";

drop index if exists "public"."chats_users_idx";

alter table "public"."chats" drop column "users";

alter table "public"."notifications" add column "topic" text;

alter table "public"."reservations" alter column "end_date" set data type date using "end_date"::date;

alter table "public"."reservations" alter column "listing_id" drop not null;

alter table "public"."reservations" alter column "start_date" set data type date using "start_date"::date;

CREATE INDEX idx_chats_id_user_id ON public.chats USING btree (id, user_id);

alter table "public"."chats" add constraint "chats_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_user_id_fkey1";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.chat_users(chat_id bigint)
 RETURNS uuid[]
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    
        SELECT ARRAY[chats.user_id, listings.user_id]
        FROM chats
        LEFT JOIN listings ON listings.id = chats.listing_id
        WHERE chats.id = chat_id
   
$function$
;

CREATE OR REPLACE FUNCTION public.set_reservation_period()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if both start_date and end_date are not null
  IF NEW."start_date" IS NOT NULL AND NEW."end_date" IS NOT NULL THEN
    -- Set the reservation_period as a tstzrange (timestamp with time zone range) with adjusted times
    NEW.reservation_period := tstzrange(
      (NEW."start_date"::timestamptz + TIME '13:00'), -- Add 13:00 time to start_date
      (NEW."end_date"::timestamptz + TIME '12:00'),  -- Add 12:00 time to end_date
      '[]'
    );
  END IF;
  
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."listing_types" to "postgres";

grant insert on table "public"."listing_types" to "postgres";

grant references on table "public"."listing_types" to "postgres";

grant select on table "public"."listing_types" to "postgres";

grant trigger on table "public"."listing_types" to "postgres";

grant truncate on table "public"."listing_types" to "postgres";

grant update on table "public"."listing_types" to "postgres";

grant delete on table "public"."listings_reports" to "postgres";

grant insert on table "public"."listings_reports" to "postgres";

grant references on table "public"."listings_reports" to "postgres";

grant select on table "public"."listings_reports" to "postgres";

grant trigger on table "public"."listings_reports" to "postgres";

grant truncate on table "public"."listings_reports" to "postgres";

grant update on table "public"."listings_reports" to "postgres";

grant delete on table "public"."places" to "postgres";

grant insert on table "public"."places" to "postgres";

grant references on table "public"."places" to "postgres";

grant select on table "public"."places" to "postgres";

grant trigger on table "public"."places" to "postgres";

grant truncate on table "public"."places" to "postgres";

grant update on table "public"."places" to "postgres";

grant delete on table "public"."post_reports" to "postgres";

grant insert on table "public"."post_reports" to "postgres";

grant references on table "public"."post_reports" to "postgres";

grant select on table "public"."post_reports" to "postgres";

grant trigger on table "public"."post_reports" to "postgres";

grant truncate on table "public"."post_reports" to "postgres";

grant update on table "public"."post_reports" to "postgres";

grant delete on table "public"."posts_ratings" to "postgres";

grant insert on table "public"."posts_ratings" to "postgres";

grant references on table "public"."posts_ratings" to "postgres";

grant select on table "public"."posts_ratings" to "postgres";

grant trigger on table "public"."posts_ratings" to "postgres";

grant truncate on table "public"."posts_ratings" to "postgres";

grant update on table "public"."posts_ratings" to "postgres";

grant delete on table "public"."room_availability" to "postgres";

grant insert on table "public"."room_availability" to "postgres";

grant references on table "public"."room_availability" to "postgres";

grant select on table "public"."room_availability" to "postgres";

grant trigger on table "public"."room_availability" to "postgres";

grant truncate on table "public"."room_availability" to "postgres";

grant update on table "public"."room_availability" to "postgres";


grant delete on table "extensions"."spatial_ref_sys" to "anon";

grant insert on table "extensions"."spatial_ref_sys" to "anon";

grant references on table "extensions"."spatial_ref_sys" to "anon";

grant select on table "extensions"."spatial_ref_sys" to "anon";

grant trigger on table "extensions"."spatial_ref_sys" to "anon";

grant truncate on table "extensions"."spatial_ref_sys" to "anon";

grant update on table "extensions"."spatial_ref_sys" to "anon";

grant delete on table "extensions"."spatial_ref_sys" to "authenticated";

grant insert on table "extensions"."spatial_ref_sys" to "authenticated";

grant references on table "extensions"."spatial_ref_sys" to "authenticated";

grant select on table "extensions"."spatial_ref_sys" to "authenticated";

grant trigger on table "extensions"."spatial_ref_sys" to "authenticated";

grant truncate on table "extensions"."spatial_ref_sys" to "authenticated";

grant update on table "extensions"."spatial_ref_sys" to "authenticated";

grant delete on table "extensions"."spatial_ref_sys" to "postgres";

grant insert on table "extensions"."spatial_ref_sys" to "postgres";

grant references on table "extensions"."spatial_ref_sys" to "postgres";

grant select on table "extensions"."spatial_ref_sys" to "postgres";

grant trigger on table "extensions"."spatial_ref_sys" to "postgres";

grant truncate on table "extensions"."spatial_ref_sys" to "postgres";

grant update on table "extensions"."spatial_ref_sys" to "postgres";

grant delete on table "extensions"."spatial_ref_sys" to "service_role";

grant insert on table "extensions"."spatial_ref_sys" to "service_role";

grant references on table "extensions"."spatial_ref_sys" to "service_role";

grant select on table "extensions"."spatial_ref_sys" to "service_role";

grant trigger on table "extensions"."spatial_ref_sys" to "service_role";
grant truncate on table "extensions"."spatial_ref_sys" to "service_role";

grant update on table "extensions"."spatial_ref_sys" to "service_role";

create policy "chats-all-policy"
on "public"."chats"
as permissive
for all
to authenticated
using (((auth.uid() = user_id) OR (auth.uid() = ANY (chat_users(id)))))
with check (((auth.uid() = user_id) OR (auth.uid() = ANY (chat_users(id)))));


create policy "notifications-delete-policy"
on "public"."notifications"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "notifications-update-policy"
on "public"."notifications"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access "
on "public"."reservations"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = variant_owner(id))));


create policy "chats_messages"
on "public"."messages"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM chats
  WHERE (chats.id = messages.chat_id))))
with check ((EXISTS ( SELECT 1
   FROM chats
  WHERE (chats.id = messages.chat_id))));


create policy "Enable read access for all users"
on "public"."notifications"
as permissive
for select
to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



