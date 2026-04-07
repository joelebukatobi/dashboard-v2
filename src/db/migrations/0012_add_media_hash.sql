-- Migration: Add hash column to media_items for deduplication
ALTER TABLE media_items ADD COLUMN hash VARCHAR(64);

-- Create index for fast hash lookups
CREATE INDEX idx_media_items_hash ON media_items(hash);

-- Add comment explaining the column
COMMENT ON COLUMN media_items.hash IS 'SHA-256 hash of file content for deduplication';
