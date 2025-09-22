CREATE
OR REPLACE FUNCTION update_listing_likes() RETURNS TRIGGER AS $$ BEGIN -- Update the likes count based on the current total in the likes table
UPDATE
    listings
SET
    likes = (
        SELECT
            COUNT(*)
        FROM
            likes
        WHERE
            listing_id = COALESCE(NEW.listing_id, OLD.listing_id)
    )
WHERE
    id = COALESCE(NEW.listing_id, OLD.listing_id);

RETURN NULL;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER likes_after_insert_delete
AFTER
INSERT
    OR DELETE ON likes FOR EACH ROW EXECUTE FUNCTION update_listing_likes();