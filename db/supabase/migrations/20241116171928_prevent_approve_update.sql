CREATE OR REPLACE FUNCTION prevent_role_change_approved()
RETURNS TRIGGER AS $$
BEGIN
    -- Check the current user's role
    IF auth.role() IN ('authenticated', 'anon') THEN
        -- Check if the approved column is being updated
        IF NEW.approved IS DISTINCT FROM OLD.approved THEN
            RAISE EXCEPTION 'You are not allowed to change the approved column';
        END IF;
    END IF;

    -- Allow the operation if the condition is not met
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER prevent_approved_update
BEFORE UPDATE OF approved ON listings
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change_approved();

CREATE OR REPLACE FUNCTION variant_owner(v_id bigint)
RETURNS uuid AS $$
DECLARE
  owner_uuid uuid;
BEGIN
  SELECT l.user_id
  INTO owner_uuid
  FROM variants v
  JOIN listings l ON l.id = v.listing_id
  WHERE v.id = v_id;

  RETURN owner_uuid;
END;
$$ LANGUAGE plpgsql;