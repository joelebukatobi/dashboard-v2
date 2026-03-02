-- Migration: Recalculate post counts for all tags
-- Run this after the tag post count tracking fix is deployed

-- Update post_count for all tags based on actual post_tags relationships
-- Use COALESCE to handle tags with no posts (returns NULL)
UPDATE tags t
SET post_count = COALESCE(
  (SELECT COUNT(*)
   FROM post_tags pt
   WHERE pt.tag_id = t.id),
  0
);
