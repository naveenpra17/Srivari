-- Future-ready publish scheduling for hero slides
ALTER TABLE hero_slider
    ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_hero_slider_publish ON hero_slider(publish_at);
