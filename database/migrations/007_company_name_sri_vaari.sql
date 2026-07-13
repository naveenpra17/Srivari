-- Update company branding to Sri Vaari Traders
UPDATE settings
SET setting_value = 'Sri Vaari Traders',
    updated_at = NOW()
WHERE setting_key = 'company_name'
  AND setting_value = 'Motors Industries';

UPDATE settings
SET setting_value = REPLACE(setting_value, 'Motors Industries', 'Sri Vaari Traders'),
    updated_at = NOW()
WHERE setting_key IN ('about_history', 'whatsapp_message_contact')
  AND setting_value LIKE '%Motors Industries%';
