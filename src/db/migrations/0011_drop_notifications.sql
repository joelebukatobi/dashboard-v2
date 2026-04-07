-- Migration: Drop notifications table
-- Created: 2026-04-07

-- Drop the notifications table
DROP TABLE IF EXISTS notifications;

-- Drop the notification_type enum
DROP TYPE IF EXISTS notification_type;
