CREATE TABLE IF NOT EXISTS ktl_product_applications (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  product text NOT NULL,
  purpose text NOT NULL,
  deployment text NOT NULL,
  team_size text NOT NULL,
  notes text NOT NULL,
  consent_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ktl_product_applications_created_idx
  ON ktl_product_applications (created_at DESC, id DESC);
