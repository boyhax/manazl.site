ALTER TABLE "public"."listings" ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

CREATE OR REPLACE FUNCTION "public".update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_update_timestamp
BEFORE UPDATE ON "public"."listings"
FOR EACH ROW
EXECUTE FUNCTION "public".update_updated_at();

