-- Dedicated catalog preview image per product (separate from gallery images)
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS catalog_image_url VARCHAR(500);

COMMENT ON COLUMN products.catalog_image_url IS 'Catalog preview image shown on product detail page; gallery images remain separate';
