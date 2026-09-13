/*
# Create fonts, pairings, and color_palettes tables

1. New Tables
- fonts: font metadata for Google Fonts (id, family, category, weights, google_fonts_url, x_height, ascender, descender, glyph_count, created_at)
- pairings: saved font pairings (id, user_id, primary_font_id, secondary_font_id, heading_size, body_size, line_height, letter_spacing, bg_color, text_color, sample_text, share_id, created_at). Unique constraint on (user_id, primary_font_id, secondary_font_id).
- color_palettes: saved color palettes (id, user_id, name, colors, created_at)

2. Security
- RLS enabled on all tables.
- fonts: publicly readable, no client writes.
- pairings: owner-scoped CRUD + public read by share_id.
- color_palettes: owner-scoped CRUD.

3. Notes
- user_id defaults to auth.uid() for RLS compliance.
- share_id enables public shareable links.
*/

CREATE TABLE IF NOT EXISTS fonts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'sans-serif',
  weights int[] NOT NULL DEFAULT ARRAY[400],
  google_fonts_url text NOT NULL,
  x_height text,
  ascender text,
  descender text,
  glyph_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fonts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_fonts" ON fonts;
CREATE POLICY "public_read_fonts" ON fonts FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS pairings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_font_id uuid NOT NULL REFERENCES fonts(id) ON DELETE CASCADE,
  secondary_font_id uuid NOT NULL REFERENCES fonts(id) ON DELETE CASCADE,
  heading_size int DEFAULT 48,
  body_size int DEFAULT 18,
  line_height numeric DEFAULT 1.5,
  letter_spacing numeric DEFAULT 0,
  bg_color text DEFAULT '#ffffff',
  text_color text DEFAULT '#1a1a1a',
  sample_text text DEFAULT 'The quick brown fox jumps over the lazy dog',
  share_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, primary_font_id, secondary_font_id)
);

ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pairings" ON pairings;
CREATE POLICY "select_own_pairings" ON pairings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pairings" ON pairings;
CREATE POLICY "insert_own_pairings" ON pairings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pairings" ON pairings;
CREATE POLICY "update_own_pairings" ON pairings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pairings" ON pairings;
CREATE POLICY "delete_own_pairings" ON pairings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_read_shared_pairings" ON pairings;
CREATE POLICY "public_read_shared_pairings" ON pairings FOR SELECT
  TO anon, authenticated USING (share_id IS NOT NULL);

CREATE TABLE IF NOT EXISTS color_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  colors text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_palettes" ON color_palettes;
CREATE POLICY "select_own_palettes" ON color_palettes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_palettes" ON color_palettes;
CREATE POLICY "insert_own_palettes" ON color_palettes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_palettes" ON color_palettes;
CREATE POLICY "update_own_palettes" ON color_palettes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_palettes" ON color_palettes;
CREATE POLICY "delete_own_palettes" ON color_palettes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_fonts_category ON fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_family ON fonts(family);
CREATE INDEX IF NOT EXISTS idx_pairings_user_id ON pairings(user_id);
CREATE INDEX IF NOT EXISTS idx_pairings_share_id ON pairings(share_id);
CREATE INDEX IF NOT EXISTS idx_palettes_user_id ON color_palettes(user_id);