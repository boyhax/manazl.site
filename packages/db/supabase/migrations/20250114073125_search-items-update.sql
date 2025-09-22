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
        locations.label_ar,
        ' ',
        locations.label_en,
        ' '
    ) as name,
    'place' :: text as type,
    locations.url_name,
    st_asgeojson (locations.location) as point
from
    locations;