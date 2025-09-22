CREATE TABLE reservation_cancel_request (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(id),
    user_id uuid NOT NULL, -- Add user_id column
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable row-level security
ALTER TABLE reservation_cancel_request ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts only from the specified user_id
CREATE POLICY insert_policy ON reservation_cancel_request
    FOR INSERT
    with check (user_id = (select auth.uid() as uid));
