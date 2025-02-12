ALTER TABLE listings ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_update_timestamp
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

