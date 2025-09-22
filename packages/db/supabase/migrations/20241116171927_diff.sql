create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

create extension if not exists "postgis" with schema "public" version '3.3.2';

drop trigger if exists "push" on "public"."notifications";

drop trigger if exists "before_insert_reservation_trigger" on "public"."reservations";

drop trigger if exists "before_update_reservation_trigger" on "public"."reservations";

drop policy "places_view_policy" on "public"."places";

drop policy "insert_policy" on "public"."reservation_cancel_request";

drop policy "delete by user only" on "public"."reservations";

drop policy "Enable UPDATE for authenticated users only" on "public"."listings";

drop policy "update by user or owner only" on "public"."reservations";

drop policy "user insert only" on "public"."reservations";

drop policy "Enable insert for authenticated users only" on "public"."variants";

drop policy "Enable read access for all users" on "public"."variants";

drop policy "give delete to owner only" on "public"."variants";

drop policy "give update to owner only" on "public"."variants";

revoke delete on table "public"."listings_state" from "anon";

revoke insert on table "public"."listings_state" from "anon";

revoke references on table "public"."listings_state" from "anon";

revoke select on table "public"."listings_state" from "anon";

revoke trigger on table "public"."listings_state" from "anon";

revoke truncate on table "public"."listings_state" from "anon";

revoke update on table "public"."listings_state" from "anon";

revoke delete on table "public"."listings_state" from "authenticated";

revoke insert on table "public"."listings_state" from "authenticated";

revoke references on table "public"."listings_state" from "authenticated";

revoke select on table "public"."listings_state" from "authenticated";

revoke trigger on table "public"."listings_state" from "authenticated";

revoke truncate on table "public"."listings_state" from "authenticated";

revoke update on table "public"."listings_state" from "authenticated";

revoke delete on table "public"."listings_state" from "service_role";

revoke insert on table "public"."listings_state" from "service_role";

revoke references on table "public"."listings_state" from "service_role";

revoke select on table "public"."listings_state" from "service_role";

revoke trigger on table "public"."listings_state" from "service_role";

revoke truncate on table "public"."listings_state" from "service_role";

revoke update on table "public"."listings_state" from "service_role";

alter table "public"."listings_state" drop constraint "listings_state_listings_id_fkey";

alter table "public"."listings_state" drop constraint "listings_state_user_id_fkey";

alter table "public"."messages" drop constraint "messages_to_user_id_fkey";

alter table "public"."reservations" drop constraint "bookings_listing_id_fkey";

alter table "public"."reservations" drop constraint "bookings_variant_id_fkey";

alter table "public"."listings" drop constraint "listings_user_id_fkey";

alter table "public"."reservation_cancel_request" drop constraint "reservation_cancel_request_reservation_id_fkey";

drop view if exists "public"."users";

drop function if exists "public"."get_listing_rooms"(p_listing_id integer, p_start date, p_end date);

drop view if exists "public"."search_items";

alter table "public"."categories" drop constraint "categorizes_pkey";

alter table "public"."listings_state" drop constraint "listings_state_pkey";

drop index if exists "public"."categorizes_pkey";

drop index if exists "public"."listings_state_pkey";

drop table "public"."listings_state";




create table "public"."listing_types" (
    "name" text not null
);


alter table "public"."categories" drop column "id";

alter table "public"."categories" alter column "name" set not null;

alter table "public"."listings" drop column "cost";

alter table "public"."listings" drop column "distance";

alter table "public"."listings" drop column "place_name";

alter table "public"."listings" drop column "places";

alter table "public"."listings" add column "address" jsonb;

alter table "public"."listings" add column "likes" numeric default '0'::numeric;

alter table "public"."listings" alter column "approved" set default false;

alter table "public"."messages" drop column "to_user_id";

alter table "public"."profiles" alter column "full_name" set default 'username'::text;

alter table "public"."reservation_cancel_request" alter column "user_id" set default auth.uid();

alter table "public"."reservations" drop column "cancel_reason";

alter table "public"."reservations" alter column "end_date" set data type timestamp without time zone using "end_date"::timestamp without time zone;

alter table "public"."reservations" alter column "start_date" set data type timestamp without time zone using "start_date"::timestamp without time zone;

alter table "public"."room_availability" enable row level security;

alter table "public"."variants" drop column "dates";

alter table "public"."variants" drop column "rate";

alter table "public"."variants" drop column "slots";

alter table "public"."variants" drop column "specific_days_only";

alter table "public"."variants" add column "type" text default '"double"'::text;



CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (name);

select 1; -- CREATE INDEX exclude_overlapping ON public.reservations USING gist (variant_id, reservation_period);

CREATE UNIQUE INDEX listing_types_pkey ON public.listing_types USING btree (name);


alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."listing_types" add constraint "listing_types_pkey" PRIMARY KEY using index "listing_types_pkey";

alter table "public"."reservation_cancel_request" add constraint "reservation_cancel_request_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservation_cancel_request" validate constraint "reservation_cancel_request_user_id_fkey";

alter table "public"."reservations" add constraint "exclude_overlapping" EXCLUDE USING gist (variant_id WITH =, reservation_period WITH &&);

alter table "public"."reservations" add constraint "reservations_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES listings(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservations" validate constraint "reservations_listing_id_fkey";

alter table "public"."reservations" add constraint "reservations_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES variants(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reservations" validate constraint "reservations_variant_id_fkey";

alter table "public"."listings" add constraint "listings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."listings" validate constraint "listings_user_id_fkey";

alter table "public"."reservation_cancel_request" add constraint "reservation_cancel_request_reservation_id_fkey" FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reservation_cancel_request" validate constraint "reservation_cancel_request_reservation_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_listing_rooms(listing_id uuid, p_start date, p_end date)
 RETURNS TABLE(hotel_id integer, hotel_name text, rooms json)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH room_costs AS (
        SELECT 
            l.id AS hotel_id,
            l.title AS hotel_name,
            r.id AS room_id,
            r.type AS room_type,
            SUM(aval.cost) AS total_cost
        FROM listings l
        JOIN variants r ON r.listing_id = l.id
        JOIN room_availability aval ON aval.room_id = r.id
        WHERE l.active = true
          AND l.approved = true
          AND l.id = listing_id
          AND aval.date >= p_start
          AND aval.date < p_end
        GROUP BY l.id, l.title, r.id, r.type
    )
    SELECT 
        hotel_id,
        hotel_name,
        ARRAY_AGG(
            JSON_BUILD_OBJECT(
                'room_id', room_id,
                'room_type', room_type,
                'total_cost', total_cost
            )
        ) AS rooms
    FROM room_costs
    GROUP BY hotel_id, hotel_name
    ORDER BY hotel_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_listing_rooms(p_listing_id integer, p_start date, p_end date)
 RETURNS TABLE(hotel_id integer, hotel_name text, rooms json)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH room_costs AS (
        SELECT 
            l.id::INTEGER AS hotel_id,  -- Cast to INTEGER
            l.title AS hotel_name,
            r.id AS room_id,
            r.type AS room_type,
            SUM(aval.cost) AS total_cost
        FROM listings l
        JOIN variants r ON r.listing_id = l.id
        JOIN room_availability aval ON aval.room_id = r.id
        WHERE l.active = true
          AND l.approved = true
          AND l.id = p_listing_id
          AND aval.date >= p_start
          AND aval.date < p_end
        GROUP BY l.id, l.title, r.id, r.type
    )
    SELECT 
        room_costs.hotel_id,
        room_costs.hotel_name,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'room_id', room_costs.room_id,
                'room_type', room_costs.room_type,
                'total_cost', room_costs.total_cost
            )
        ) AS rooms
    FROM room_costs
    GROUP BY room_costs.hotel_id, room_costs.hotel_name
    ORDER BY room_costs.hotel_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.nearby_listings(p_lat double precision, p_lng double precision, p_radius double precision)
 RETURNS SETOF listings
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM listings
    WHERE st_dwithin(geo_location, ST_MakePoint(p_lng, p_lat), p_radius)
    and active=true and approved =true
    ORDER BY st_distance(geo_location, ST_MakePoint(p_lng, p_lat));
END;
$function$
;

create or replace view "public"."search_items" as  SELECT listings.title AS name,
    'host'::text AS type,
    listings.images[1] AS image,
    st_asgeojson(st_point(listings.lng, listings.lat)) AS point
   FROM listings
UNION
 SELECT concat((places.name ->> 'ar'::text), ' ', (places.name ->> 'en'::text), ' ') AS name,
    'place'::text AS type,
    places.image,
    st_asgeojson(places.geo_point) AS point
   FROM places;


CREATE OR REPLACE FUNCTION public.update_geo_location()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN NEW.geo_location := ST_Point(NEW.lng, NEW.lat) :: geography;

RETURN NEW;

END;$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_likes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update the likes count based on the current total in the likes table
    UPDATE listings
    SET likes = (SELECT COUNT(*) FROM likes WHERE listing_id = COALESCE(NEW.listing_id, OLD.listing_id))
    WHERE id = COALESCE(NEW.listing_id, OLD.listing_id);
    
    RETURN NULL;
END;
$function$
;



grant delete on table "public"."listing_types" to "anon";

grant insert on table "public"."listing_types" to "anon";

grant references on table "public"."listing_types" to "anon";

grant select on table "public"."listing_types" to "anon";

grant trigger on table "public"."listing_types" to "anon";

grant truncate on table "public"."listing_types" to "anon";

grant update on table "public"."listing_types" to "anon";

grant delete on table "public"."listing_types" to "authenticated";

grant insert on table "public"."listing_types" to "authenticated";

grant references on table "public"."listing_types" to "authenticated";

grant select on table "public"."listing_types" to "authenticated";

grant trigger on table "public"."listing_types" to "authenticated";

grant truncate on table "public"."listing_types" to "authenticated";

grant update on table "public"."listing_types" to "authenticated";

grant delete on table "public"."listing_types" to "postgres";

grant insert on table "public"."listing_types" to "postgres";

grant references on table "public"."listing_types" to "postgres";

grant select on table "public"."listing_types" to "postgres";

grant trigger on table "public"."listing_types" to "postgres";

grant truncate on table "public"."listing_types" to "postgres";

grant update on table "public"."listing_types" to "postgres";

grant delete on table "public"."listing_types" to "service_role";

grant insert on table "public"."listing_types" to "service_role";

grant references on table "public"."listing_types" to "service_role";

grant select on table "public"."listing_types" to "service_role";

grant trigger on table "public"."listing_types" to "service_role";

grant truncate on table "public"."listing_types" to "service_role";

grant update on table "public"."listing_types" to "service_role";

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


create policy "places_select_policy"
on "public"."places"
as permissive
for select
to authenticated, anon
using (true);


create policy "Enable insert for users based on user_id"
on "public"."reservation_cancel_request"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "allow-select"
on "public"."reservation_cancel_request"
as permissive
for select
to authenticated
using (true);


create policy "room_availability_delete_policy"
on "public"."room_availability"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = ( SELECT variants.listing_id
           FROM variants
          WHERE (variants.id = room_availability.room_id))))));


create policy "room_availability_insert_policy"
on "public"."room_availability"
as permissive
for insert
to authenticated
with check (((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = ( SELECT variants.listing_id
           FROM variants
          WHERE (variants.id = room_availability.room_id))))) AND (date >= CURRENT_DATE)));


create policy "room_availability_select_policy"
on "public"."room_availability"
as permissive
for select
to authenticated, anon
using (true);


create policy "room_availability_update_policy"
on "public"."room_availability"
as permissive
for update
to authenticated
using (((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = ( SELECT variants.listing_id
           FROM variants
          WHERE (variants.id = room_availability.room_id))))) AND (date >= CURRENT_DATE)))
with check (((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = ( SELECT variants.listing_id
           FROM variants
          WHERE (variants.id = room_availability.room_id))))) AND (date >= CURRENT_DATE)));


create policy "Enable UPDATE for authenticated users only"
on "public"."listings"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "update by user or owner only"
on "public"."reservations"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "user insert only"
on "public"."reservations"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."variants"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = variants.listing_id))));


create policy "Enable read access for all users"
on "public"."variants"
as permissive
for select
to authenticated, anon
using (((active = true) OR (auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = variants.listing_id)))));


create policy "give delete to owner only"
on "public"."variants"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = variants.listing_id))));


create policy "give update to owner only"
on "public"."variants"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT listings.user_id
   FROM listings
  WHERE (listings.id = variants.listing_id))));


CREATE TRIGGER "pushonmanazl-web" AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://manazl-web.vercel.app/api/push', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


