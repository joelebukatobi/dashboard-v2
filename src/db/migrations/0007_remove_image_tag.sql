-- Migration: Remove tag column from media_items table
-- Tags are no longer used for images

ALTER TABLE media_items DROP COLUMN tag;
