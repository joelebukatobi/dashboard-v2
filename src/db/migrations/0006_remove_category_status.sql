-- Migration: Remove status column from categories table
-- Categories no longer need publish/draft status

ALTER TABLE categories DROP COLUMN status;

-- Drop the enum type if no longer needed
DROP TYPE IF EXISTS category_status;
