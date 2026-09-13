/*
# Create brand_themes table

1. New Tables
- `brand_themes` - Stores user-saved brand design themes with full token sets
  - id (uuid, primary key)
  - user_id (uuid, nullable, defaults to auth.uid() for user-created themes; null for presets)
  - name (text, not null) - theme name e.g. "Ocean Breeze"
  - tokens (jsonb, not null) - all color/typography/spacing/shadow tokens
  - is_preset (boolean, default false) - true for seeded preset themes available to all
  - created_at (timestamptz, default now())
2. Security
- Enable RLS on `brand_themes`.
- Owner-scoped CRUD: authenticated users can only access their own rows.
- Preset themes (is_preset = true, user_id = null) are readable by all authenticated users.
3. Seed Data
- Inserts 4 preset brand themes: Ocean, Sunset, Forest, Midnight with full token sets
*/

CREATE TABLE IF NOT EXISTS brand_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  tokens jsonb NOT NULL,
  is_preset boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brand_themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_brand_themes" ON brand_themes;
CREATE POLICY "select_own_brand_themes" ON brand_themes FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_preset = true);

DROP POLICY IF EXISTS "insert_own_brand_themes" ON brand_themes;
CREATE POLICY "insert_own_brand_themes" ON brand_themes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_brand_themes" ON brand_themes;
CREATE POLICY "update_own_brand_themes" ON brand_themes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_brand_themes" ON brand_themes;
CREATE POLICY "delete_own_brand_themes" ON brand_themes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

INSERT INTO brand_themes (user_id, name, tokens, is_preset) VALUES
  (NULL, 'Ocean', '{"colors":{"primary":"#0d9488","secondary":"#14b8a6","accent":"#5eead4","neutral":"#64748b","background":"#f0fdfa","surface":"#ffffff","border":"#ccfbf1","error":"#ef4444","warning":"#f59e0b","success":"#22c55e"},"typography":{"headingFont":"Playfair Display","bodyFont":"Inter","headingSize":"48","bodySize":"16","headingWeight":"700","bodyWeight":"400","lineHeight":"1.6","letterSpacing":"0"},"spacing":{"baseUnit":"4","radius":"8","shadow":"0 4px 6px -1px rgba(0,0,0,0.1)"}}', true),
  (NULL, 'Sunset', '{"colors":{"primary":"#f97316","secondary":"#fb923c","accent":"#fdba74","neutral":"#78716c","background":"#fff7ed","surface":"#ffffff","border":"#fed7aa","error":"#dc2626","warning":"#d97706","success":"#16a34a"},"typography":{"headingFont":"Poppins","bodyFont":"Inter","headingSize":"48","bodySize":"16","headingWeight":"700","bodyWeight":"400","lineHeight":"1.6","letterSpacing":"0"},"spacing":{"baseUnit":"4","radius":"12","shadow":"0 4px 6px -1px rgba(249,115,22,0.15)"}}', true),
  (NULL, 'Forest', '{"colors":{"primary":"#166534","secondary":"#15803d","accent":"#22c55e","neutral":"#525252","background":"#f0fdf4","surface":"#ffffff","border":"#bbf7d0","error":"#dc2626","warning":"#ca8a04","success":"#16a34a"},"typography":{"headingFont":"Merriweather","bodyFont":"Source Sans Pro","headingSize":"44","bodySize":"16","headingWeight":"700","bodyWeight":"400","lineHeight":"1.6","letterSpacing":"0"},"spacing":{"baseUnit":"4","radius":"6","shadow":"0 2px 4px -1px rgba(22,101,52,0.1)"}}', true),
  (NULL, 'Midnight', '{"colors":{"primary":"#6366f1","secondary":"#818cf8","accent":"#a78bfa","neutral":"#94a3b8","background":"#0f172a","surface":"#1e293b","border":"#334155","error":"#ef4444","warning":"#f59e0b","success":"#22c55e"},"typography":{"headingFont":"Montserrat","bodyFont":"Inter","headingSize":"48","bodySize":"16","headingWeight":"700","bodyWeight":"400","lineHeight":"1.6","letterSpacing":"0"},"spacing":{"baseUnit":"4","radius":"10","shadow":"0 10px 15px -3px rgba(0,0,0,0.4)"}}', true)
ON CONFLICT DO NOTHING;
