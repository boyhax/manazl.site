-- Add constraints to the listings table


ALTER TABLE "public"."listings"
DROP CONSTRAINT IF EXISTS "listings_title_check",
ADD CONSTRAINT "listings_title_check" CHECK (length("title") <= 100),
ADD CONSTRAINT "listings_description_check" CHECK (length("description") <= 500);

