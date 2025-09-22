DROP TRIGGER IF EXISTS update_likes_count_trigger ON public.likes;

-- Drop the function
DROP FUNCTION IF EXISTS public.update_likes_count();

-- Drop the 'likes' column from the 'listings' table
ALTER TABLE listings 
DROP COLUMN likes;