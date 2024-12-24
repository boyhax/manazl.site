drop function nearby_listings(
    double precision,
    double precision,
    double precision
);

CREATE
OR REPLACE FUNCTION public.nearby_listings(
    p_lat double precision,
    p_lng double precision,
    p_radius double precision
) RETURNS SETOF public.listings LANGUAGE plpgsql SECURITY INVOKER -- Ensures the function runs with the privileges of the user who calls it
AS $$ BEGIN RETURN QUERY
SELECT
    *
FROM
    listings
WHERE
    st_dwithin(
        geo_location,
        ST_MakePoint(p_lng, p_lat),
        p_radius
    )
    and active = true
    and approved = true
ORDER BY
    st_distance(geo_location, ST_MakePoint(p_lng, p_lat));
END;
$$;