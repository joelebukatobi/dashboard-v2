-- Migration: Recalculate post counts for all categories
-- Run this after the post count tracking fix is deployed

-- Update post_count for all categories based on actual published posts
-- Use COALESCE to handle categories with no posts (returns NULL)
UPDATE categories c
SET post_count = COALESCE(
  (SELECT COUNT(*)
   FROM posts p
   WHERE p.category_id = c.id
     AND p.status = 'PUBLISHED'),
  0
);
