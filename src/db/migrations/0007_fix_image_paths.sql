-- Migration: Update image paths to include /public prefix
-- Fix paths for proper static file serving

UPDATE media_items
SET 
  path = '/public' || path,
  thumbnail_path = '/public' || thumbnail_path
WHERE type = 'IMAGE' 
  AND path NOT LIKE '/public/%';
