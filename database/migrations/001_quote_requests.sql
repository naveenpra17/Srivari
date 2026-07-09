-- Quote Requests table (run on existing database)
CREATE TABLE IF NOT EXISTS quote_requests (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT       REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200),
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    company     VARCHAR(150),
    quantity    INT,
    message     TEXT,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_read ON quote_requests(is_read);
CREATE INDEX IF NOT EXISTS idx_quote_requests_product ON quote_requests(product_id);
