-- Fix invalid placeholder admin password hash from early seed data
UPDATE users
SET password = '$2b$12$9tws8X2zoqvakz/d/VpiseNxzGaogWPK.WdHOb9BPa5uQ.km3R.TS',
    updated_at = NOW()
WHERE email = 'admin@motors.com'
  AND password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oXH5qK5qK5qK';
