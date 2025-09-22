-- Add a constraint to the states column in the reservations table


-- Drop the existing constraint
ALTER TABLE reservations
DROP CONSTRAINT check_states;

-- Update the states column to use the new values
UPDATE reservations SET states = 'pending' WHERE states = 'new';
UPDATE reservations SET states = 'confirmed' WHERE states = 'arrival';
UPDATE reservations SET states = 'confirmed' WHERE states = 'checked';
UPDATE reservations SET states = 'completed' WHERE states = 'ended';
UPDATE reservations SET states = 'cancelled' WHERE states = 'canceled';

-- Create the reservation_states enum type
CREATE TYPE reservation_states AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed'
);

-- Remove the default value from the states column
ALTER TABLE reservations
ALTER COLUMN states DROP DEFAULT;

-- Alter the states column to use the reservation_states enum type
ALTER TABLE reservations
ALTER COLUMN states TYPE reservation_states USING states::text::reservation_states;

-- Set the default value for the states column
ALTER TABLE reservations
ALTER COLUMN states SET DEFAULT 'pending'::reservation_states;


-- Rename the states column to state
ALTER TABLE reservations
RENAME COLUMN states TO state;

