DROP FUNCTION IF EXISTS prevent_overbooking();




-- Function for before insert
CREATE OR REPLACE FUNCTION before_insert_reservation()
RETURNS TRIGGER AS $$
DECLARE
  available_slots INTEGER;
  overlapping_reservations INTEGER;
BEGIN
    -- Ensure listing_id is not null
    IF NEW.listing_id IS NULL THEN
        RAISE EXCEPTION 'listing_id cannot be null';
    END IF;
    
    -- Check for available slots
    SELECT slots INTO available_slots
    FROM variants
    WHERE id = NEW.variant_id;

    -- Count overlapping reservations for the same variant within the date range
    SELECT COUNT(*)
    INTO overlapping_reservations
    FROM reservations
    WHERE variant_id = NEW.variant_id
      AND NEW.start_date <= end_date
      AND NEW.end_date >= start_date;

    -- Check if the number of overlapping reservations exceeds the available slots
    IF overlapping_reservations >= available_slots THEN
      RAISE EXCEPTION 'No available slots for this variant in the selected period';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for before insert
CREATE TRIGGER before_insert_reservation_trigger
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION before_insert_reservation();

-- Function for before update
CREATE OR REPLACE FUNCTION before_update_reservation()
RETURNS TRIGGER AS $$
DECLARE
    listing_owner_id UUID;
BEGIN
    -- Ensure listing_id is not null
    IF NEW.listing_id IS NULL THEN
        RAISE EXCEPTION 'listing_id cannot be null';
    END IF;
    
    -- Prevent changes to listing_id
    IF OLD.listing_id != NEW.listing_id THEN
        RAISE EXCEPTION 'listing_id cannot be changed';
    END IF;

    -- Prevent changes to user_id
    IF OLD.user_id != NEW.user_id THEN
        RAISE EXCEPTION 'user_id cannot be changed';
    END IF;


    -- Get the user_id of the listing owner
    SELECT user_id INTO listing_owner_id
    FROM listings
    WHERE id = NEW.listing_id;

    -- Allow updates only from service_role or the listing owner
    IF NOT (auth.role() = 'service_role' OR auth.uid() = listing_owner_id) THEN
        RAISE EXCEPTION 'Only the listing owner or service_role can update this reservation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for before update
CREATE TRIGGER before_update_reservation_trigger
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION before_update_reservation();