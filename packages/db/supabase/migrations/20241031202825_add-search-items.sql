create
or replace view search_items WITH (security_invoker) as
select
    listings.title as name,
    'host' :: text as type,
    listings.images [1] as image,
    st_asgeojson (st_point (listings.lng, listings.lat)) as point
from
    listings
union
select
    concat(
        places.name ->> 'ar' :: text,
        ' ',
        places.name ->> 'en' :: text,
        ' '
    ) as name,
    'place' :: text as type,
    places.image,
    st_asgeojson (places.geo_point) as point
from
    places;