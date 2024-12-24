
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public,extensions', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_hashids" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_listing_owner"("listing_id" bigint) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$ begin return (
    select
        l.user_id
    from
        listings l
    where
        l.id = listing_id
);

end;

$$;

ALTER FUNCTION "public"."get_listing_owner"("listing_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_owner"("variant_id" integer) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$ begin return (
    select
        l.user_id
    from
        bookings b
        join variants v on v.id = b.variant_id
        join listings l on l.id = v.listing_id
);
end;
$$;

ALTER FUNCTION "public"."get_owner"("variant_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_variant_owner"("variant_id" bigint) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$ begin return (
    select
        l.user_id
    from
        variants v
        join listings l on l.id = v.listing_id
    where
        v.id = variant_id
);
end;
$$;

ALTER FUNCTION "public"."get_variant_owner"("variant_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_listing"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$ begin
insert into
    public.states (id,listing_id)
values
    (new.id,new.id);
return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_listing"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN
UPDATE
    listings
SET
    rating = (
        SELECT
            AVG(rating)
        FROM
            reviews
        WHERE
            listing_id = NEW.listing_id
    )
WHERE
    listings.id = NEW.listing_id;

RETURN NEW;

END;

$$;

ALTER FUNCTION "public"."handle_new_rating"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$ begin
insert into
    public.profiles (id, full_name, avatar_url, email)
values
    (
        new.id,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url',
        new.email
    );

return new;

end;

$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


create trigger "on_auth_user_created"
  after insert on "auth"."users"
  for each row execute procedure "public"."handle_new_user"();


SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "title" "text" DEFAULT ''::"text",
    "description" "text" DEFAULT ''::"text",
    "cost" numeric DEFAULT '1'::numeric,
    "images" "text"[],
    "tags" "text"[],
    "thumbnail" "text",
    "meta" "jsonb" DEFAULT '{"cost": "ask for price", "currency": "omr", "pay_cycle": "daily"}'::"jsonb",
    "fts" "text",
    "approved" boolean DEFAULT true,
    "active" boolean DEFAULT true,
    "place_name" "text",
    "place_point" real[] DEFAULT '{0,0}'::real[] NOT NULL,
    "featured" boolean DEFAULT false,
    "rating" integer DEFAULT 0,
    "type" "text" DEFAULT ''::"text",
    "amenities" "text"[],
    "likes" integer DEFAULT 0 NOT NULL,
    "short_id" character varying GENERATED ALWAYS AS ("extensions"."id_encode"("id")) STORED,
    "geo_location" "geography",
    "places" "text"[],
    CONSTRAINT "listings_title_check" CHECK (("length"("title") < 60))
);

ALTER TABLE "public"."listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "text" "text",
    "listing_id" bigint,
    "post_id" bigint,
    "replay_to" bigint
);


ALTER TABLE "public"."comments" OWNER TO "postgres";

COMMENT ON TABLE "public"."comments" IS 'comments for both posts or listings';

ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE FUNCTION "public"."listings_in_view"("min_lat" double precision, "min_lng" double precision, "max_lat" double precision, "max_lng" double precision) RETURNS SETOF "public"."listings"
    LANGUAGE "plpgsql"
    AS $$BEGIN RETURN query
SELECT
    *
FROM
    listings
where
    geo_location::geometry  && ST_MakeBox2D(
        ST_Point(min_lng, min_lat),
        ST_Point(max_lng, max_lat)
    );

END;$$;

ALTER FUNCTION "public"."listings_in_view"("min_lat" double precision, "min_lng" double precision, "max_lat" double precision, "max_lng" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."nearby_listings"("lat" double precision, "long" double precision, "radius" double precision) RETURNS SETOF "public"."listings"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM listings
    WHERE ST_DWithin(geo_location, ST_MakePoint(long, lat), radius)
    ORDER BY ST_Distance(geo_location, st_point(long,lat));
END;
$$;

ALTER FUNCTION "public"."nearby_listings"("lat" double precision, "long" double precision, "radius" double precision) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."sort_uuid_array"("uuid"[]) RETURNS "uuid"[]
    LANGUAGE "sql" IMMUTABLE
    AS $_$
SELECT array_agg(val ORDER BY val)
FROM unnest($1) AS val;
$_$;

ALTER FUNCTION "public"."sort_uuid_array"("uuid"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."title_description"("public"."listings") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
SELECT
    $ 1.title || ' ' || $ 1.description;

$_$;

ALTER FUNCTION "public"."title_description"("public"."listings") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_fts"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$ BEGIN NEW.fts := NEW.description || ' ' || NEW.title || ' ' || COALESCE(array_to_string(NEW.tags, ' '), '');

RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_fts"() OWNER TO "postgres";



CREATE OR REPLACE FUNCTION "public"."update_geo_location"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN NEW.geo_location := ST_Point(NEW.place_point [2], NEW.place_point [1]) :: geography;

RETURN NEW;

END;$$;


CREATE OR REPLACE FUNCTION "public"."update_likes_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$ BEGIN IF (TG_OP = 'INSERT') THEN
UPDATE
    listings
SET
    likes = likes + 1
WHERE
    id = NEW.listing_id;

ELSIF (TG_OP = 'DELETE') THEN
UPDATE
    listings
SET
    likes = likes - 1
WHERE
    id = OLD.listing_id;

END IF;

RETURN NULL;

END;

$$;

ALTER FUNCTION "public"."update_likes_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$$;

ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ads" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "listing_id" bigint,
    "title" "text",
    "body" "text",
    "url" "text",
    "image_url" "text",
    "user_id" "uuid",
    "views" integer,
    "clicks" integer,
    "active" boolean DEFAULT false,
    "approved" boolean,
    "points" smallint DEFAULT '1000'::smallint
);

ALTER TABLE "public"."ads" OWNER TO "postgres";

ALTER TABLE "public"."ads" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ads_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "variant_id" bigint,
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "updated_at" timestamp without time zone,
    "total_pay" real,
    "approved" boolean DEFAULT false NOT NULL,
    "short_id" character varying GENERATED ALWAYS AS ("extensions"."id_encode"("id")) STORED,
    "cancel_reason" "text",
    "states" "text" DEFAULT 'new'::"text" NOT NULL,
    "end_date" "date" NOT NULL,
    "payment_id" character varying,
    "start_date" "date" NOT NULL,
    CONSTRAINT "check_states" CHECK (("states" = ANY (ARRAY['new'::"text", 'canceled'::"text", 'checked'::"text", 'arrival'::"text", 'ended'::"text"])))
);

ALTER TABLE "public"."bookings" OWNER TO "postgres";

ALTER TABLE "public"."bookings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."bookings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "image" "text",
    "parent_catagory" bigint,
    "description" "text"
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."catagories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "users" "uuid"[]
);

ALTER TABLE "public"."chats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "text" "text",
    "to_user_id" "uuid",
    "url" "text",
    "chat_id" bigint,
    "is_read" boolean DEFAULT false
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "avatar_url" "text" DEFAULT 'https://ui-avatars.com/api/?name=John+Doe'::"text",
    "website" "text",
    "full_name" "text",
    "banned" boolean DEFAULT false,
    "email" "text",
    "contact" "json",
    "cover_url" "text" DEFAULT 'https://i2.wp.com/ui-avatars.com/api/manazl/128?ssl=1'::"text",
    "fcm_token" "text",
    "name" "text",
    "listings" bigint[],
    "notifications" "json" DEFAULT '{"messages":true,   "bookings":true,   "ads":true}'::"json"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."chat_overview" AS
 WITH "last_messages" AS (
         SELECT DISTINCT ON ("messages"."chat_id") "messages"."chat_id",
            "messages"."text" AS "last_message",
            "messages"."created_at" AS "last_message_time",
            "messages"."is_read"
           FROM "public"."messages"
          ORDER BY "messages"."chat_id", "messages"."created_at" DESC
        ), "unread_messages" AS (
         SELECT "messages"."chat_id",
            "count"(*) AS "unread_count"
           FROM "public"."messages"
          WHERE (("messages"."is_read" = false) AND ("messages"."chat_id" IN ( SELECT "chats"."id"
                   FROM "public"."chats"
                  WHERE ("auth"."uid"() = ANY ("chats"."users")))) AND (( SELECT "unnest"("chats"."users") AS "unnest"
                   FROM "public"."chats"
                  WHERE ("chats"."id" = "messages"."chat_id")) <> "auth"."uid"()))
          GROUP BY "messages"."chat_id"
        ), "other_user_profiles" AS (
         SELECT "c_1"."id" AS "chat_id",
            "p"."id",
            "p"."avatar_url",
            "p"."full_name"
           FROM ("public"."chats" "c_1"
             JOIN "public"."profiles" "p" ON ((("p"."id" = ANY ("c_1"."users")) AND ("p"."id" <> "auth"."uid"()))))
        )
 SELECT "c"."id" AS "chat_id",
    "lm"."last_message",
    "lm"."last_message_time",
    "oup"."avatar_url",
    "oup"."full_name",
    COALESCE("um"."unread_count", (0)::bigint) AS "unread_count"
   FROM ((("public"."chats" "c"
     LEFT JOIN "last_messages" "lm" ON (("c"."id" = "lm"."chat_id")))
     LEFT JOIN "unread_messages" "um" ON (("c"."id" = "um"."chat_id")))
     LEFT JOIN "other_user_profiles" "oup" ON (("c"."id" = "oup"."chat_id")))
  WHERE ("auth"."uid"() = ANY ("c"."users"));

ALTER TABLE "public"."chat_overview" OWNER TO "postgres";

ALTER TABLE "public"."chats" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chats_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."feedbacks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "message" "text",
    "type" "text",
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "contact" "text",
    "body" "json"
);

ALTER TABLE "public"."feedbacks" OWNER TO "postgres";

ALTER TABLE "public"."feedbacks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."feedbacks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "listing_id" bigint NOT NULL,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

ALTER TABLE "public"."likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."locales" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "transulations" "json",
    "name_local" "text",
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."locales" OWNER TO "postgres";

ALTER TABLE "public"."locales" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."locales_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."metas" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "key" character varying NOT NULL,
    "value" "json",
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."metas" OWNER TO "postgres";

ALTER TABLE "public"."metas" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."metas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "body" "text",
    "image_url" "text",
    "url" "text",
    "active" boolean DEFAULT true
);

ALTER TABLE "public"."news" OWNER TO "postgres";

ALTER TABLE "public"."news" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."news_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "body" "text",
    "url" "text",
    "buttons" "json",
    "received" boolean DEFAULT false
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "booking_id" bigint,
    "total_amount" real,
    "status" "text",
    "transaction_id" character varying,
    "payment_method " character varying,
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['Pending'::"text", 'Completed'::"text", 'Failed'::"text"])))
);

ALTER TABLE "public"."payments" OWNER TO "postgres";

ALTER TABLE "public"."payments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);






CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "body" "text",
    "title" "text",
    "url" "text",
    "listing_id" bigint,
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    "short_id" character varying GENERATED ALWAYS AS ("extensions"."id_encode"("id")) STORED
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

ALTER TABLE "public"."posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."listings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."property_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "text" "text",
    "rating" smallint NOT NULL,
    "listing_id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"(),
    CONSTRAINT "check_rating" CHECK ((("rating" >= 1) AND ("rating" <= 100)))
);

ALTER TABLE "public"."reviews" OWNER TO "postgres";

ALTER TABLE "public"."reviews" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ratings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "latest_version" smallint DEFAULT '1'::smallint,
    "name" "text" DEFAULT ''::"text"
);

ALTER TABLE "public"."settings" OWNER TO "postgres";

ALTER TABLE "public"."settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "likes" integer DEFAULT 0,
    "shares" integer DEFAULT 0,
    "views" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."states" OWNER TO "postgres";

ALTER TABLE "public"."states" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."variants" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "listing_id" bigint,
    "dates" "date"[],
    "thumbnail" "text",
    "title" "text",
    "inventory" smallint,
    "rate" numeric,
    "specific_days_only" boolean DEFAULT false,
    "active" boolean DEFAULT true,
    "short_id" character varying GENERATED ALWAYS AS ("extensions"."id_encode"("id")) STORED,
    "beds" smallint DEFAULT '1'::smallint,
    "guests" smallint DEFAULT '2'::smallint,
    "rooms" smallint DEFAULT '1'::smallint,
    "description" "text" DEFAULT ''::"text"
);

ALTER TABLE "public"."variants" OWNER TO "postgres";

ALTER TABLE "public"."variants" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."variants_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


CREATE UNIQUE INDEX "chats_unique__users_index" ON "public"."chats" USING "btree" ("public"."sort_uuid_array"("users"));

CREATE INDEX "chats_users_idx" ON "public"."chats" USING "btree" ("users");

CREATE INDEX "likes_listing_id_user_id_idx" ON "public"."likes" USING "btree" ("listing_id", "user_id");

CREATE INDEX "listings_fts_idx" ON "public"."listings" USING "btree" ("fts");

CREATE INDEX "listings_geo_location_idx" ON "public"."listings" USING "gist" ("geo_location");

CREATE INDEX "listings_tags_featured_likes_type_rating_idx" ON "public"."listings" USING "btree" ("tags", "featured", "likes", "type", "rating");

CREATE INDEX "locales_name_idx" ON "public"."locales" USING "btree" ("name" "varchar_ops") WITH ("deduplicate_items"='true');

CREATE INDEX "messages_chat_id_idx" ON "public"."messages" USING "btree" ("chat_id");

CREATE INDEX "notifications_user_id_idx" ON "public"."notifications" USING "btree" ("user_id");

CREATE INDEX "ratings_listing_id_idx" ON "public"."reviews" USING "hash" ("listing_id");

CREATE OR REPLACE TRIGGER "locals_updated_at" AFTER UPDATE ON "public"."locales" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "metas_updated_at_trigger" BEFORE UPDATE ON "public"."metas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();

CREATE OR REPLACE TRIGGER "on_listing_created" AFTER INSERT ON "public"."listings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_listing"();

CREATE OR REPLACE TRIGGER "on_rating_created" AFTER INSERT OR UPDATE ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_rating"();

CREATE OR REPLACE TRIGGER "push" AFTER INSERT ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://api.manazl.site/functions/v1/push', 'POST', '{"Content-type":"application/json"}', '{}', '1000');

CREATE OR REPLACE TRIGGER "update_fts" BEFORE INSERT OR UPDATE ON "public"."listings" FOR EACH ROW EXECUTE FUNCTION "public"."update_fts"();

CREATE OR REPLACE TRIGGER "update_geo_location_trigger" BEFORE INSERT OR UPDATE ON "public"."listings" FOR EACH ROW EXECUTE FUNCTION "public"."update_geo_location"();


CREATE OR REPLACE TRIGGER "update_likes_count_trigger" AFTER INSERT OR DELETE ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_likes_count"();

ALTER TABLE "public"."likes" ENABLE ALWAYS TRIGGER "update_likes_count_trigger";

ALTER TABLE ONLY "public"."ads"
    ADD CONSTRAINT "ads_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "catagories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feedbacks"
    ADD CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."variants"
    ADD CONSTRAINT "listings_variants_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."locales"
    ADD CONSTRAINT "locales_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."metas"
    ADD CONSTRAINT "metas_pkey" PRIMARY KEY ("id", "key");

ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");


ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "property_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "ratings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ads"
    ADD CONSTRAINT "ads_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id");

ALTER TABLE ONLY "public"."ads"
    ADD CONSTRAINT "ads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id");

ALTER TABLE ONLY "public"."feedbacks"
    ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_replay_to_fkey" FOREIGN KEY ("replay_to") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."variants"
    ADD CONSTRAINT "variants_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY  "Enable UPDATE for authenticated users only" ON "public"."listings" FOR UPDATE TO "authenticated", "anon" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (true);

CREATE POLICY  "Enable delete for users based on user_id" ON "public"."likes" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Enable delete for users based on user_id" ON "public"."listings" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Enable delete for users based on user_id" ON "public"."messages" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY  "Enable insert for authenticated users only" ON "public"."variants" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "public"."get_listing_owner"("listing_id")));

CREATE POLICY  "Enable insert for users based on user_id" ON "public"."likes" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Enable insert for users based on user_id" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Enable read access for all users" ON "public"."likes" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."locales" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."metas" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."news" FOR SELECT TO "authenticated", "anon" USING (("active" = true));

CREATE POLICY  "Enable read access for all users" ON "public"."notifications" FOR SELECT TO "authenticated", "anon" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));

CREATE POLICY  "Enable read access for all users" ON "public"."posts" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."reviews" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."settings" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Enable read access for all users" ON "public"."variants" FOR SELECT TO "authenticated", "anon" USING ((("active" = true) OR ("auth"."uid"() = "public"."get_listing_owner"("listing_id"))));

CREATE POLICY  "Enable read access for anon users" ON "public"."feedbacks" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY  "Enable read access for anon users" ON "public"."listings" FOR SELECT TO "authenticated", "anon" USING (((("active" = true) AND ("approved" = true)) OR ("user_id" = "auth"."uid"())));

CREATE POLICY  "Enable update access for authunicated users" ON "public"."feedbacks" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY  "Enable update for users based on email" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY  "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY  "Users can update own profile." ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."ads" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "allow insert to owner only" ON "public"."listings" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable delete for users based on user_id" ON "public"."comments" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable update for users based on email" ON "public"."comments" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable insert for authenticated users only" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Enable read access for all users" ON "public"."comments" FOR SELECT TO "authenticated", "anon" USING (true);
ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "chats policy" ON "public"."chats" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ANY ("users"))) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ANY ("users")));

CREATE POLICY  "delete by user only" ON "public"."bookings" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));

ALTER TABLE "public"."feedbacks" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "give delete to owner only" ON "public"."variants" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "public"."get_listing_owner"("listing_id")));

CREATE POLICY  "give update to owner only" ON "public"."variants" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "public"."get_listing_owner"("listing_id")));

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."locales" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "messages_insert_policy" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (( SELECT "auth"."uid"() AS "uid") IN ( SELECT "unnest"("chats"."users") AS "unnest"
   FROM "public"."chats"
  WHERE ("chats"."id" = "messages"."chat_id")))));

CREATE POLICY  "messages_select_policy" ON "public"."messages" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "text") IN ( SELECT "unnest"("chats"."users") AS "unnest"
   FROM "public"."chats"
  WHERE ("chats"."id" = "messages"."chat_id"))));

ALTER TABLE "public"."metas" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "name" ON "public"."ads" FOR SELECT TO "anon" USING (true);

ALTER TABLE "public"."news" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;



ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."states" ENABLE ROW LEVEL SECURITY;

CREATE POLICY  "update by user or owner only" ON "public"."bookings" FOR UPDATE TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR (( SELECT "auth"."uid"() AS "uid") = "public"."get_variant_owner"("variant_id"))));

CREATE POLICY  "user insert only" ON "public"."bookings" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));

ALTER TABLE "public"."variants" ENABLE ROW LEVEL SECURITY;

-- CREATE PUBLICATION "logflare_pub" WITH (publish = 'insert, update, delete, truncate');

-- ALTER PUBLICATION "logflare_pub" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chats";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


GRANT ALL ON TABLE "public"."ads" TO "anon";
GRANT ALL ON TABLE "public"."ads" TO "authenticated";
GRANT ALL ON TABLE "public"."ads" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ads_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ads_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ads_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."catagories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."catagories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."catagories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "postgres";
GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."chat_overview" TO "postgres";
GRANT ALL ON TABLE "public"."chat_overview" TO "anon";
GRANT ALL ON TABLE "public"."chat_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_overview" TO "service_role";

GRANT ALL ON SEQUENCE "public"."chats_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chats_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chats_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comment_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."feedbacks" TO "anon";
GRANT ALL ON TABLE "public"."feedbacks" TO "authenticated";
GRANT ALL ON TABLE "public"."feedbacks" TO "service_role";

GRANT ALL ON SEQUENCE "public"."feedbacks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feedbacks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feedbacks_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."locales" TO "anon";
GRANT ALL ON TABLE "public"."locales" TO "authenticated";
GRANT ALL ON TABLE "public"."locales" TO "service_role";

GRANT ALL ON SEQUENCE "public"."locales_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."locales_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."locales_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."metas" TO "anon";
GRANT ALL ON TABLE "public"."metas" TO "authenticated";
GRANT ALL ON TABLE "public"."metas" TO "service_role";

GRANT ALL ON SEQUENCE "public"."metas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."metas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."metas_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."news" TO "anon";
GRANT ALL ON TABLE "public"."news" TO "authenticated";
GRANT ALL ON TABLE "public"."news" TO "service_role";

GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "service_role";




GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."property_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."property_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."property_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";

GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."variants" TO "anon";
GRANT ALL ON TABLE "public"."variants" TO "authenticated";
GRANT ALL ON TABLE "public"."variants" TO "service_role";

GRANT ALL ON SEQUENCE "public"."variants_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."variants_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."variants_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
