-- Migration: Add nested comments support
-- Created: 2026-04-03

-- Add parentId for nested/threaded comments
ALTER TABLE comments ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Change default status to APPROVED (auto-approve comments)
ALTER TABLE comments ALTER COLUMN status SET DEFAULT 'APPROVED';

-- Update existing comments to APPROVED status
UPDATE comments SET status = 'APPROVED' WHERE status = 'PENDING';

-- Make author fields optional (for potential future anonymous comments)
ALTER TABLE comments ALTER COLUMN author_name DROP NOT NULL;
ALTER TABLE comments ALTER COLUMN author_email DROP NOT NULL;

-- Add edit tracking
ALTER TABLE comments ADD COLUMN is_edited BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE comments ADD COLUMN edited_at TIMESTAMP;

-- Create index for faster parent lookups
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Create index for post + created_at (for pagination)
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at DESC);
