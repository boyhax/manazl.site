-- Make variant_id nullable
ALTER TABLE reservations
ALTER COLUMN variant_id DROP NOT NULL;

-- Make listing_id not nullable
ALTER TABLE reservations
ALTER COLUMN listing_id SET NOT NULL;
