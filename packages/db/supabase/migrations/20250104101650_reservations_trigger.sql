CREATE OR REPLACE FUNCTION "public".get_room_cost(variant_id bigint, checkin DATE, checkout DATE) RETURNS NUMERIC AS $$ DECLARE total_cost NUMERIC := 0;

room_count INT;

BEGIN -- Check if any rooms are available in the given date range
SELECT
    COUNT(*) INTO room_count
FROM
    room_availability
WHERE
    room_id = variant_id
    AND date >= checkin
    AND date < checkout;

-- If no rooms are available, raise an exception
IF room_count = 0 THEN RAISE EXCEPTION 'No rooms available for variant_id: % between % and %',
variant_id,
checkin,
checkout;

END IF;

-- Calculate the total cost for the room within the given date range
SELECT
    COALESCE(SUM(cost), 0) INTO total_cost
FROM
    room_availability
WHERE
    room_id = variant_id
    AND date >= checkin
    AND date < checkout;

RETURN total_cost;

END;

$$ LANGUAGE plpgsql security invoker;

CREATE
OR REPLACE FUNCTION "public".update_total_pay_trigger() RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER AS $$ BEGIN -- Update total_pay based on the get_room_cost function
NEW.total_pay := get_room_cost(NEW.variant_id, NEW.start_date, NEW.end_date);

RETURN NEW;

END;

$$;

-- Step 3: Create the trigger on the reservations table
CREATE TRIGGER update_total_pay BEFORE
INSERT
    OR
UPDATE
    OF variant_id,
    start_date,
    end_date,
    total_pay -- Trigger on relevant columns
    ON "public".reservations FOR EACH ROW EXECUTE FUNCTION "public".update_total_pay_trigger();