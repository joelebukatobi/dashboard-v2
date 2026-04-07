-- Migration: Remove color_class column from categories table
-- Created: 2026-04-06

ALTER TABLE categories DROP COLUMN IF EXISTS color_class;
