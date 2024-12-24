
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- create image buckets manualy from dashboard as public bucket or run next sql from dashboard

-- INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
-- 	( 1,'images', NULL, '2024-02-21 08:27:34.017744+00', '2024-02-21 08:27:34.017744+00', true, false, NULL, NULL, NULL);

-- insert into "storage"."buckets" ("id", "name")
--   values ('images', 'images');

CREATE POLICY "Give users delete to own folder in images" ON "storage"."objects" FOR DELETE TO "authenticated" USING ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users insert to own folder in images" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users update to own folder in images" ON "storage"."objects" FOR UPDATE TO "authenticated" USING ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

RESET ALL;
