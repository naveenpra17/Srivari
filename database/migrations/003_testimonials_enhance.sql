-- Enhanced testimonials for premium UI (run on existing databases)
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS slug VARCHAR(200);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS likes INT NOT NULL DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS full_story TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);

CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_slug ON testimonials(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_testimonials_category ON testimonials(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);

UPDATE testimonials SET slug = LOWER(REGEXP_REPLACE(client_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || id
WHERE slug IS NULL OR slug = '';

UPDATE testimonials SET category = 'Manufacturing', featured = TRUE, verified = TRUE, likes = 42
WHERE client_name = 'Rajesh Kumar';

UPDATE testimonials SET category = 'Energy', featured = TRUE, verified = TRUE, likes = 38
WHERE client_name = 'Sarah Mitchell';

UPDATE testimonials SET category = 'Energy', featured = FALSE, verified = TRUE, likes = 27
WHERE client_name = 'Ahmed Hassan';

UPDATE testimonials SET full_story = content WHERE full_story IS NULL;
