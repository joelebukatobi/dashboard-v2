-- Migration: Add COMMENT_CREATED and SUBSCRIBER_CREATED to activity_type enum
-- Created: 2026-04-06

-- Add the new values to the activity_type enum
ALTER TYPE activity_type ADD VALUE 'COMMENT_CREATED';
ALTER TYPE activity_type ADD VALUE 'SUBSCRIBER_CREATED';
