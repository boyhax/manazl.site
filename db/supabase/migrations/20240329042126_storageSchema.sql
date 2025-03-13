
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


CREATE POLICY "Give users delete to own folder in images" ON "storage"."objects" FOR DELETE TO "authenticated" USING ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users insert to own folder in images" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users update to own folder in images" ON "storage"."objects" FOR UPDATE TO "authenticated" USING ((("bucket_id" = 'images'::"text") AND (("auth"."uid"())::"text" = ("storage"."foldername"("name"))[1])));

RESET ALL;
