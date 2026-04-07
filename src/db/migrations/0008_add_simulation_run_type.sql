-- Migration: Add SIMULATION_RUN to activity_type enum
-- Created: 2026-04-06

-- Add the new value to the activity_type enum
ALTER TYPE activity_type ADD VALUE 'SIMULATION_RUN';
