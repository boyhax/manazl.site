ALTER TABLE listings
ADD COLUMN lat FLOAT NOT NULL default 0.00,
ADD COLUMN lng FLOAT NOT NULL default 0.00;

ALTER TABLE listings
ALTER COLUMN lat DROP DEFAULT,
ALTER COLUMN lng DROP DEFAULT;

UPDATE listings
SET lat = place_point[1],
    lng = place_point[2];

ALTER TABLE listings
DROP COLUMN place_point;


CREATE OR REPLACE FUNCTION "public"."update_geo_location"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN NEW.geo_location := ST_Point(NEW.lng, NEW.lat) :: geography;

RETURN NEW;
END;$$;