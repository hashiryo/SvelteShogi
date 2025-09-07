-- Add user_id columns to existing tables
ALTER TABLE favorite_shogi_moves 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE game_records 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE shogi_moves_statistics 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing data to have null user_id (anonymous data)
-- In a real migration, you might want to assign existing data to a specific user

-- Create indexes for better performance
CREATE INDEX idx_favorite_moves_user_id ON favorite_shogi_moves(user_id);
CREATE INDEX idx_game_records_user_id ON game_records(user_id);
CREATE INDEX idx_moves_statistics_user_id ON shogi_moves_statistics(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Policy with security definer functions" ON favorite_shogi_moves;
DROP POLICY IF EXISTS "Policy with security definer functions" ON game_records;
DROP POLICY IF EXISTS "Policy with security definer functions" ON shogi_moves_statistics;

-- Create new RLS policies for user-specific data access
CREATE POLICY "Users can manage their own favorite moves" 
ON favorite_shogi_moves 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage their own game records" 
ON game_records 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage their own move statistics" 
ON shogi_moves_statistics 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous access for backward compatibility
-- (user_id IS NULL allows access to anonymous data)

-- Create policies for public read access to anonymous data (if needed)
CREATE POLICY "Public read access to anonymous favorite moves" 
ON favorite_shogi_moves 
FOR SELECT 
USING (user_id IS NULL);

CREATE POLICY "Public read access to anonymous game records" 
ON game_records 
FOR SELECT 
USING (user_id IS NULL);

CREATE POLICY "Public read access to anonymous move statistics" 
ON shogi_moves_statistics 
FOR SELECT 
USING (user_id IS NULL);