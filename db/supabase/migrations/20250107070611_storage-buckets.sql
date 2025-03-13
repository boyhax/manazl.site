INSERT INTO
    "storage"."buckets" (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
VALUES
    (
        'images',
        'images',
        true,
        5242880,
        ARRAY ['image/jpg', 'image/png', 'image/jpeg']
    )
ON CONFLICT (id) 
DO UPDATE SET
    name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;