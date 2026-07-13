-- Enrich product catalog with images and specifications

UPDATE products SET
  image_url = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85',
  description = 'Our industrial AC motors deliver exceptional performance, energy efficiency, and reliability for demanding manufacturing environments. Built with precision engineering and premium materials, these motors are ideal for compressors, conveyors, machine tools, and process equipment.',
  specifications = '{
    "Motor Type": "Three Phase Induction Motor",
    "Power Range": "1 HP to 50 HP",
    "Voltage": "415V AC, 3 Phase",
    "Frequency": "50 Hz",
    "Speed": "1440 RPM (4 Pole)",
    "Efficiency Class": "IE2 / IE3",
    "Enclosure": "TEFC (Totally Enclosed Fan Cooled)",
    "Mounting": "Foot / Flange (B3 / B5)",
    "Insulation Class": "Class F",
    "Protection": "IP55",
    "Ambient Temperature": "Up to 45°C",
    "Application": "Compressors, conveyors, machine tools, industrial drives"
  }'::jsonb
WHERE slug = 'industrial-ac-motor';

UPDATE products SET
  image_url = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85',
  specifications = '{
    "Pump Type": "Centrifugal End Suction Pump",
    "Flow Rate": "Up to 120 m³/hr",
    "Head": "Up to 60 meters",
    "Power": "1 HP to 15 HP",
    "Inlet/Outlet": "1.5\" to 4\"",
    "Material": "Cast Iron with SS Impeller option",
    "Seal Type": "Mechanical Seal",
    "Application": "Water transfer, irrigation, HVAC, industrial circulation"
  }'::jsonb
WHERE slug = 'centrifugal-pump';

UPDATE products SET
  image_url = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=85',
  specifications = '{
    "Material Grade": "SS 304 / SS 316",
    "Diameter Range": "1/2\" to 8\"",
    "Wall Thickness": "Schedule 10 / 40 / 80",
    "Standard": "ASTM A312",
    "Finish": "Pickled & Annealed",
    "Application": "Chemical processing, marine, food grade, industrial piping"
  }'::jsonb
WHERE slug = 'stainless-steel-pipes';

UPDATE products SET
  image_url = 'https://images.unsplash.com/photo-1581092162384-89889c1a33f0?w=1200&q=85',
  specifications = '{
    "Type": "Flexible Jaw / Gear Coupling",
    "Torque Range": "10 Nm to 5000 Nm",
    "Bore Range": "10 mm to 120 mm",
    "Material": "Aluminium / Steel Hub with PU Spider",
    "Max RPM": "Up to 6000 RPM",
    "Application": "Motor to pump, gearbox, and compressor connections"
  }'::jsonb
WHERE slug = 'motor-couplings';

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT p.id, p.image_url, p.name, 0, TRUE
FROM products p
WHERE p.slug = 'industrial-ac-motor'
  AND p.image_url IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85', p.name, 1, FALSE
FROM products p
WHERE p.slug = 'industrial-ac-motor'
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi
    WHERE pi.product_id = p.id
      AND pi.image_url = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85'
  );

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT p.id, p.image_url, p.name, 0, TRUE
FROM products p
WHERE p.slug IN ('centrifugal-pump', 'stainless-steel-pipes', 'motor-couplings')
  AND p.image_url IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);
