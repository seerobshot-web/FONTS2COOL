/*
# Allow public access to preset brand themes

1. Modified Tables
- `brand_themes` - No columns changed.
2. Security Changes
- The SELECT policy now allows both anonymous and authenticated visitors to read preset themes.
- User-created themes remain restricted to their authenticated owner.
- INSERT, UPDATE, and DELETE remain authenticated owner-only.
3. Important Notes
- Preset rows are identified by `is_preset = true`.
- This allows the signed-out Brand Theme page to display the four built-in themes without exposing saved user themes.
*/

DROP POLICY IF EXISTS "select_own_brand_themes" ON brand_themes;
CREATE POLICY "select_own_brand_themes" ON brand_themes FOR SELECT
  TO anon, authenticated USING (auth.uid() = user_id OR is_preset = true);
