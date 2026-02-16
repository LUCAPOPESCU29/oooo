-- Create cabins table
CREATE TABLE IF NOT EXISTS cabins (
  id SERIAL PRIMARY KEY,
  cabin_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  sqft INTEGER,
  hero_image TEXT,
  images JSONB,
  amenities JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert existing cabins
INSERT INTO cabins (cabin_id, name, slug, description, long_description, price_per_night, guests, bedrooms, bathrooms, sqft, hero_image, images, amenities) VALUES
(
  '1',
  'The Pine',
  'the-pine',
  'Cozy two-bedroom retreat with floor-to-ceiling windows and forest views',
  'Perched among towering pine trees, The Pine offers a cozy two-bedroom retreat with floor-to-ceiling windows, a wood-burning fireplace, and a private deck overlooking the forest canopy. Wake up to birdsong and fall asleep under the stars.

This thoughtfully designed cabin combines rustic charm with modern comfort. The open-plan living area features vaulted ceilings and abundant natural light, while the fully-equipped kitchen makes meal preparation a joy. Step outside to your private deck and soak in the hot tub while surrounded by nature.

Perfect for couples or small families seeking a peaceful escape from the everyday. Every detail has been carefully considered to ensure your stay is both comfortable and memorable.',
  250,
  4,
  2,
  1,
  850,
  'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1600&q=80',
  '["https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1600&q=80", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1600&q=80", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"]',
  '["WiFi", "Fireplace", "Full Kitchen", "Hot Tub", "Forest Views", "Hiking Access", "Free Parking", "Pet Friendly"]'
),
(
  '2',
  'The Cedar',
  'the-cedar',
  'Spacious three-bedroom cabin with mountain views and premium amenities',
  'Our larger A-frame, The Cedar, is wrapped in warm cedar wood and features an open-plan living space, a chef''s kitchen, and a wraparound deck with mountain views. Perfect for families or small groups looking for a premium nature escape.

With three bedrooms and two bathrooms, The Cedar comfortably accommodates up to six guests. The expansive deck offers multiple seating areas, including an outdoor dining space and a luxurious hot tub with panoramic mountain views. Fire up the BBQ grill for an al fresco dinner under the stars.

Inside, you''ll find high-end finishes throughout, from the gourmet kitchen with professional appliances to the cozy living room with its statement fireplace. Large windows frame the stunning landscape, bringing the beauty of nature indoors while maintaining your comfort and privacy.',
  350,
  6,
  3,
  2,
  1100,
  'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1600&q=80',
  '["https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1600&q=80", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80", "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1600&q=80"]',
  '["WiFi", "Fireplace", "Full Kitchen", "Hot Tub", "Mountain Views", "Hiking Access", "Free Parking", "Pet Friendly", "BBQ Grill", "Outdoor Dining"]'
)
ON CONFLICT (cabin_id) DO UPDATE SET
  name = EXCLUDED.name,
  price_per_night = EXCLUDED.price_per_night,
  guests = EXCLUDED.guests,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  sqft = EXCLUDED.sqft;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_cabins_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_cabins_timestamp ON cabins;
CREATE TRIGGER update_cabins_timestamp
  BEFORE UPDATE ON cabins
  FOR EACH ROW
  EXECUTE FUNCTION update_cabins_timestamp();

-- Enable RLS
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;

-- Everyone can read active cabins
CREATE POLICY "Anyone can read active cabins"
  ON cabins
  FOR SELECT
  USING (is_active = true);

-- Admin can do everything
CREATE POLICY "Admin can manage cabins"
  ON cabins
  FOR ALL
  USING (true)
  WITH CHECK (true);
