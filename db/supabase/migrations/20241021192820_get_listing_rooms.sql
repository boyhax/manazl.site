CREATE OR REPLACE FUNCTION get_listing_rooms(
    p_listing_id INT,
    p_start DATE,
    p_end DATE
)
RETURNS TABLE (
    hotel_id INT,
    hotel_name TEXT,
    rooms JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH room_costs AS (
        SELECT 
            l.id::INTEGER AS hotel_id,  -- Cast to INTEGER
            l.title AS hotel_name,
            r.id AS room_id,
            r.type AS room_type,
            SUM(aval.cost) AS total_cost
        FROM listings l
        JOIN variants r ON r.listing_id = l.id
        JOIN room_availability aval ON aval.room_id = r.id
        WHERE l.active = true
          AND l.approved = true
          AND l.id = p_listing_id
          AND aval.date >= p_start
          AND aval.date < p_end
        GROUP BY l.id, l.title, r.id, r.type
    )
    SELECT 
        room_costs.hotel_id,
        room_costs.hotel_name,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'room_id', room_costs.room_id,
                'room_type', room_costs.room_type,
                'total_cost', room_costs.total_cost
            )
        ) AS rooms
    FROM room_costs
    GROUP BY room_costs.hotel_id, room_costs.hotel_name
    ORDER BY room_costs.hotel_id;
END;
$$ LANGUAGE plpgsql;
