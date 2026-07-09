-- WhatsApp & chat widget settings (run on existing databases)
INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
    ('chat_provider', 'whatsapp', 'STRING', 'Active chat provider (whatsapp, tawk, crisp, intercom, none)'),
    ('chat_widget_enabled', 'true', 'BOOLEAN', 'Show floating chat widget on public site'),
    ('whatsapp_phone', '', 'STRING', 'WhatsApp number digits only (empty uses company phone)'),
    ('whatsapp_tooltip', 'Chat with us on WhatsApp', 'STRING', 'Chat widget tooltip text'),
    ('whatsapp_message_general', 'Hello, I would like to know more about your products.', 'TEXT', 'Default WhatsApp message'),
    ('whatsapp_message_product', 'Hello, I am interested in {productName}. Please share more details.', 'TEXT', 'WhatsApp message on product pages'),
    ('whatsapp_message_contact', 'Hello, I would like to get in touch with Motors Industries.', 'TEXT', 'WhatsApp message on contact section')
ON CONFLICT (setting_key) DO NOTHING;
