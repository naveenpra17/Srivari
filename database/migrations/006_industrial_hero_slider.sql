-- Replace testimonial hero slides with industrial manufacturing content
UPDATE hero_slider SET active = FALSE WHERE cta_link LIKE '%testimonials%' OR secondary_cta_link LIKE '%testimonials%';

UPDATE hero_slider SET
  title = 'Where Innovation Meets Reliability',
  subtitle = 'Industrial Excellence',
  description = 'Premium pumps, motors & pipes engineered for industrial excellence, built for tomorrow.',
  image_url = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80',
  cta_text = 'Explore Products',
  cta_link = '/products',
  secondary_cta_text = 'Watch Video',
  secondary_cta_link = '/#gallery',
  sort_order = 1,
  active = TRUE
WHERE sort_order = 1;

UPDATE hero_slider SET
  title = 'High-Performance Industrial Motors',
  subtitle = 'Motors',
  description = 'Precision-engineered motors delivering unmatched efficiency for demanding manufacturing environments.',
  image_url = 'https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=1200&q=80',
  cta_text = 'View Motors',
  cta_link = '/products',
  secondary_cta_text = 'Get Quote',
  secondary_cta_link = '/#contact',
  sort_order = 2,
  active = TRUE
WHERE sort_order = 2;

UPDATE hero_slider SET
  title = 'Heavy-Duty Industrial Pumps',
  subtitle = 'Pumps',
  description = 'Robust centrifugal and submersible pumps built for continuous operation in critical applications.',
  image_url = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80',
  cta_text = 'View Pumps',
  cta_link = '/products',
  secondary_cta_text = 'Watch Video',
  secondary_cta_link = '/#gallery',
  sort_order = 3,
  active = TRUE
WHERE sort_order = 3;

UPDATE hero_slider SET
  title = 'Durable Industrial Pipes & Valves',
  subtitle = 'Pipes & Valves',
  description = 'Corrosion-resistant piping systems and precision valves for oil, gas, water and chemical industries.',
  image_url = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
  cta_text = 'Browse Catalog',
  cta_link = '/products',
  secondary_cta_text = 'Contact Us',
  secondary_cta_link = '/#contact',
  sort_order = 4,
  active = TRUE
WHERE sort_order = 4;
