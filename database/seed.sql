-- Motors Website - Seed Data
-- Run after schema.sql

INSERT INTO roles (name, description) VALUES
    ('ADMIN',  'Full system access'),
    ('EDITOR', 'Content management access'),
    ('VIEWER', 'Read-only admin access');

-- Default admin: admin@motors.com / Admin@123
INSERT INTO users (email, password, first_name, last_name, phone, active) VALUES
    ('admin@motors.com',
     '$2b$12$9tws8X2zoqvakz/d/VpiseNxzGaogWPK.WdHOb9BPa5uQ.km3R.TS',
     'System',
     'Administrator',
     '+91-9876543210',
     TRUE);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@motors.com' AND r.name = 'ADMIN';

INSERT INTO categories (name, slug, description, sort_order, active) VALUES
    ('Motors',      'motors',      'High-performance industrial motors', 1, TRUE),
    ('Pumps',       'pumps',       'Premium industrial pumps',           2, TRUE),
    ('Pipes',       'pipes',       'Durable industrial piping solutions', 3, TRUE),
    ('Accessories', 'accessories', 'Motor and pump accessories',         4, TRUE);

INSERT INTO products (category_id, name, slug, short_description, description, featured, active, sort_order) VALUES
    (1, 'Industrial AC Motor', 'industrial-ac-motor',
     'High-efficiency AC motors for heavy-duty applications.',
     'Our industrial AC motors deliver exceptional performance, energy efficiency, and reliability for demanding manufacturing environments.',
     TRUE, TRUE, 1),
    (2, 'Centrifugal Pump', 'centrifugal-pump',
     'Robust centrifugal pumps for fluid transfer.',
     'Engineered for maximum flow rate and minimal maintenance in industrial fluid handling systems.',
     TRUE, TRUE, 2),
    (3, 'Stainless Steel Pipes', 'stainless-steel-pipes',
     'Corrosion-resistant piping for harsh environments.',
     'Premium grade stainless steel pipes designed for chemical, marine, and industrial applications.',
     TRUE, TRUE, 3),
    (4, 'Motor Couplings', 'motor-couplings',
     'Precision couplings for seamless power transmission.',
     'High-torque couplings ensuring smooth and efficient power transfer between motors and driven equipment.',
     TRUE, TRUE, 4);

INSERT INTO industries (name, slug, description, icon, sort_order, active) VALUES
    ('Oil & Gas', 'oil-gas',       'Solutions for upstream and downstream operations', 'oil_barrel',  1, TRUE),
    ('Mining',    'mining',        'Heavy-duty equipment for mining operations',       'pickaxe',     2, TRUE),
    ('Marine',    'marine',        'Corrosion-resistant marine solutions',             'anchor',      3, TRUE),
    ('Power',     'power',         'Reliable power generation equipment',              'bolt',        4, TRUE),
    ('Chemical',  'chemical',      'Chemical-resistant industrial solutions',          'science',     5, TRUE),
    ('Water',     'water',         'Water treatment and distribution systems',         'water_drop',  6, TRUE);

INSERT INTO hero_slider (title, subtitle, description, image_url, cta_text, cta_link, secondary_cta_text, secondary_cta_link, sort_order, active) VALUES
    ('Where Innovation Meets Reliability',
     'Industrial Excellence',
     'Premium pumps, motors & pipes engineered for industrial excellence, built for tomorrow.',
     'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80',
     'Explore Products', '/products',
     'Watch Video', '/#gallery',
     1, TRUE),
    ('High-Performance Industrial Motors',
     'Motors',
     'Precision-engineered motors delivering unmatched efficiency for demanding manufacturing environments.',
     'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=1200&q=80',
     'View Motors', '/products',
     'Get Quote', '/#contact',
     2, TRUE),
    ('Heavy-Duty Industrial Pumps',
     'Pumps',
     'Robust centrifugal and submersible pumps built for continuous operation in critical applications.',
     'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80',
     'View Pumps', '/products',
     'Watch Video', '/#gallery',
     3, TRUE),
    ('Durable Industrial Pipes & Valves',
     'Pipes & Valves',
     'Corrosion-resistant piping systems and precision valves for oil, gas, water and chemical industries.',
     'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
     'Browse Catalog', '/products',
     'Contact Us', '/#contact',
     4, TRUE);

INSERT INTO testimonials (client_name, designation, company, content, full_story, rating, sort_order, active, slug, category, featured, verified, likes) VALUES
    ('Rajesh Kumar', 'Plant Manager', 'Tata Steel',
     'Sri Vaari Traders delivered exceptional quality motors that exceeded our performance expectations. Their support team is outstanding.',
     'Sri Vaari Traders delivered exceptional quality motors that exceeded our performance expectations. Their support team is outstanding. We integrated their solutions across three production lines and saw measurable uptime improvements within the first quarter.',
     5, 1, TRUE, 'rajesh-kumar', 'Manufacturing', TRUE, TRUE, 42),
    ('Sarah Mitchell', 'Operations Director', 'Shell Energy',
     'We have been partnering with Sri Vaari Traders for over 5 years. Their products are reliable and their service is world-class.',
     'We have been partnering with Sri Vaari Traders for over 5 years. Their products are reliable and their service is world-class. From procurement to after-sales support, every interaction reflects their commitment to partnership.',
     5, 2, TRUE, 'sarah-mitchell', 'Energy', TRUE, TRUE, 38),
    ('Ahmed Hassan', 'Chief Engineer', 'ADNOC',
     'The industrial pumps we procured have significantly improved our operational efficiency. Highly recommended.',
     'The industrial pumps we procured have significantly improved our operational efficiency. Highly recommended for any organization seeking durable, high-performance industrial equipment.',
     5, 3, TRUE, 'ahmed-hassan', 'Energy', FALSE, TRUE, 27);

INSERT INTO gallery (title, description, image_url, category, sort_order, active) VALUES
    ('Manufacturing Facility', 'State-of-the-art production line', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 'Facility', 1, TRUE),
    ('Motor Assembly', 'Precision motor assembly process', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 'Production', 2, TRUE),
    ('Quality Testing', 'Rigorous quality assurance testing', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 'Quality', 3, TRUE),
    ('Global Shipping', 'Worldwide delivery network', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 'Logistics', 4, TRUE);

INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
    ('company_name',        'Sri Vaari Traders', 'STRING', 'Company display name'),
    ('company_tagline',     'Where Innovation Meets Reliability', 'STRING', 'Company tagline'),
    ('company_phone',       '+91-9876543210', 'STRING', 'Primary contact phone'),
    ('company_email',       'info@motors.com', 'STRING', 'Primary contact email'),
    ('company_address',     '123 Industrial Estate, Mumbai, Maharashtra 400001, India', 'STRING', 'Company address'),
    ('company_working_hours', 'Mon - Sat: 9:00 AM - 6:00 PM', 'STRING', 'Working hours'),
    ('google_maps_embed',   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.8777!3d19.0760', 'STRING', 'Google Maps embed URL'),
    ('facebook_url',        'https://facebook.com/motors', 'STRING', 'Facebook page URL'),
    ('linkedin_url',        'https://linkedin.com/company/motors', 'STRING', 'LinkedIn page URL'),
    ('twitter_url',         'https://twitter.com/motors', 'STRING', 'Twitter page URL'),
    ('instagram_url',       'https://instagram.com/motors', 'STRING', 'Instagram page URL'),
    ('years_experience',    '25', 'NUMBER', 'Years of experience stat'),
    ('happy_clients',       '1500', 'NUMBER', 'Happy clients stat'),
    ('products_delivered',  '5000', 'NUMBER', 'Products delivered stat'),
    ('countries_served',    '50', 'NUMBER', 'Countries served stat'),
    ('about_mission',       'To deliver world-class industrial motors and pumps that power industries globally with innovation and reliability.', 'TEXT', 'Company mission'),
    ('about_vision',        'To be the most trusted name in industrial motor solutions across emerging and developed markets.', 'TEXT', 'Company vision'),
    ('about_history',       'Founded in 1999, Sri Vaari Traders has grown from a small workshop to a global leader in industrial motor manufacturing, serving clients in over 50 countries.', 'TEXT', 'Company history'),
    ('about_achievements',  'ISO 9001:2015 Certified | CE Marked Products | 25+ Industry Awards | Export Excellence Award 2023', 'TEXT', 'Company achievements'),
    ('chat_provider',       'whatsapp', 'STRING', 'Active chat provider'),
    ('chat_widget_enabled', 'true', 'BOOLEAN', 'Show floating chat widget'),
    ('whatsapp_phone',      '', 'STRING', 'WhatsApp number (empty uses company phone)'),
    ('whatsapp_tooltip',    'Chat with us on WhatsApp', 'STRING', 'Chat widget tooltip'),
    ('whatsapp_message_general', 'Hello, I would like to know more about your products.', 'TEXT', 'Default WhatsApp message'),
    ('whatsapp_message_product', 'Hello, I am interested in {productName}. Please share more details.', 'TEXT', 'Product page WhatsApp message'),
    ('whatsapp_message_contact', 'Hello, I would like to get in touch with Sri Vaari Traders.', 'TEXT', 'Contact WhatsApp message');
