create extension btree_gist;


alter table reservations
drop column start_date,
drop column end_date;

alter table reservations 
add column  reservation_period tstzrange;

CREATE OR REPLACE FUNCTION set_reservation_period()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if both start_date and end_date are not null
  IF NEW."start_date" IS NOT NULL AND NEW."end_date" IS NOT NULL THEN
    -- Set the reservation_period as a tstzrange (timestamp with time zone range) with adjusted times
    NEW.reservation_period := tstzrange(
      (NEW."start_date"::timestamptz + TIME '13:00'), -- Add 13:00 time to start_date
      (NEW."end_date"::timestamptz + TIME '12:00'),  -- Add 12:00 time to end_date
      '[]'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;





