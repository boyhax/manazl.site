revoke delete on table "public"."listing_types"
from
    "anon";

revoke
insert
    on table "public"."listing_types"
from
    "anon";

revoke references on table "public"."listing_types"
from
    "anon";

revoke
select
    on table "public"."listing_types"
from
    "anon";

revoke trigger on table "public"."listing_types"
from
    "anon";

revoke truncate on table "public"."listing_types"
from
    "anon";

revoke
update
    on table "public"."listing_types"
from
    "anon";

revoke delete on table "public"."listing_types"
from
    "authenticated";

revoke
insert
    on table "public"."listing_types"
from
    "authenticated";

revoke references on table "public"."listing_types"
from
    "authenticated";

revoke
select
    on table "public"."listing_types"
from
    "authenticated";

revoke trigger on table "public"."listing_types"
from
    "authenticated";

revoke truncate on table "public"."listing_types"
from
    "authenticated";

revoke
update
    on table "public"."listing_types"
from
    "authenticated";

revoke delete on table "public"."listing_types"
from
    "service_role";

revoke
insert
    on table "public"."listing_types"
from
    "service_role";

revoke references on table "public"."listing_types"
from
    "service_role";

revoke
select
    on table "public"."listing_types"
from
    "service_role";

revoke trigger on table "public"."listing_types"
from
    "service_role";

revoke truncate on table "public"."listing_types"
from
    "service_role";

revoke
update
    on table "public"."listing_types"
from
    "service_role";

alter table
    "public"."listing_types" drop constraint "listing_types_pkey";

drop index if exists "public"."listing_types_pkey";

drop table "public"."listing_types";

create table "public"."locations" (
    "slug" text not null,
    "label_ar" text not null,
    "label_en" text not null,
    "url_name" text not null,
    "type" text not null,
    "parent_slug" text,
    "location" geography(Point, 4326),
    "lat" double precision,
    "lng" double precision
);

alter table
    "public"."locations" enable row level security;

alter table
    "public"."amenities" enable row level security;

alter table
    "public"."host_types" enable row level security;

CREATE UNIQUE INDEX locations_slug_key ON public.locations USING btree (slug);

alter table
    "public"."locations"
add
    constraint "locations_parent_slug_fkey" FOREIGN KEY (parent_slug) REFERENCES locations(slug) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table
    "public"."locations" validate constraint "locations_parent_slug_fkey";

alter table
    "public"."locations"
add
    constraint "locations_slug_key" UNIQUE using index "locations_slug_key";

alter table
    "public"."locations"
add
    constraint "locations_type_check" CHECK (
        (
            type = ANY (
                ARRAY ['country'::text, 'state'::text, 'city'::text]
            )
        )
    ) not valid;

alter table
    "public"."locations" validate constraint "locations_type_check";

grant delete on table "public"."locations" to "anon";

grant
insert
    on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant
select
    on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant
update
    on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant
insert
    on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant
select
    on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant
update
    on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant
insert
    on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant
select
    on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant
update
    on table "public"."locations" to "service_role";

create policy "select-amenities" on "public"."amenities" as permissive for
select
    to authenticated,
    anon using (true);

create policy "select-policy-host-types" on "public"."host_types" as permissive for
select
    to anon,
    authenticated using (true);

create policy "select-locations" on "public"."locations" as permissive for
select
    to anon,
    authenticated using (true);