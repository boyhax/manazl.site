CREATE
OR REPLACE FUNCTION "public"."update_likes_count"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN IF (TG_OP = 'INSERT') THEN
UPDATE
    states
SET
    likes = likes + 1
WHERE
    listing_id = NEW.listing_id;
ELSIF (TG_OP = 'DELETE') THEN
UPDATE
    states
SET
    likes = likes - 1
WHERE
    listing_id = OLD.listing_id;
END IF;
RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."handle_new_listing"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$ begin
insert into
    public.states (listing_id)
values
    (new.id);
return new;
end;
$$;
CREATE OR REPLACE TRIGGER "on_listing_created" AFTER INSERT ON "public"."listings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_listing"();

create policy "states_select_policy"
on "public"."states"
as PERMISSIVE
for SELECT
to authenticated, anon
using (
true
);

alter table
    states
add column listing_id bigint null,
add constraint states_pkey primary key (id),
add constraint states_listing_id_fkey foreign key (listing_id) references listings (id) on update cascade on delete cascade;


ALTER TABLE likes 
ADD UNIQUE  (listing_id,user_id);