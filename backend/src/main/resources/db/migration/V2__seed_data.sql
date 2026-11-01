-- ShopSphere Sample Data
-- Migration V2: Categories and Products

-- Categories
INSERT INTO categories (name, description, image_url, slug, active) VALUES
('Electronics', 'Latest gadgets, smartphones, laptops, and tech accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'electronics', true),
('Clothing', 'Trendy fashion for men and women', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 'clothing', true),
('Books', 'Bestsellers, classics, and educational titles', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 'books', true),
('Home & Kitchen', 'Everything for your home, cooking, and living spaces', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'home-kitchen', true),
('Sports & Outdoors', 'Equipment and gear for active lifestyles', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', 'sports-outdoors', true),
('Beauty & Health', 'Skincare, wellness, and personal care products', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', 'beauty-health', true)
ON CONFLICT (name) DO NOTHING;

-- Products
INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Apple AirPods Pro (2nd Gen)',
       'Active Noise Cancellation, Adaptive Audio, Transparency mode, USB-C charging. Up to 30 hours total battery life.',
       24999.00, 50,
       'https://images.unsplash.com/photo-1606741965236-0cf4c9e3a6e2?w=400',
       'Apple', 'APP-AIRPODS-PRO2', true, true,
       (SELECT id FROM categories WHERE name = 'Electronics')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APP-AIRPODS-PRO2');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Samsung 4K QLED Smart TV 55"',
       'Quantum HDR, Neo Quantum Processor 4K, Object Tracking Sound, Gaming Hub. Dolby Atmos.',
       79999.00, 20,
       'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
       'Samsung', 'SAM-TV-55QLED', true, true,
       (SELECT id FROM categories WHERE name = 'Electronics')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'SAM-TV-55QLED');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Mechanical Gaming Keyboard RGB',
       'TKL layout, Cherry MX Red switches, per-key RGB lighting, aluminum top plate, anti-ghosting.',
       5999.00, 75,
       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
       'HyperX', 'HX-KB-MECH-RGB', true, false,
       (SELECT id FROM categories WHERE name = 'Electronics')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HX-KB-MECH-RGB');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Sony WH-1000XM5 Headphones',
       'Industry-leading noise canceling, 30hr battery, multipoint connection, LDAC support, foldable design.',
       34999.00, 30,
       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
       'Sony', 'SNY-WH1000XM5', true, true,
       (SELECT id FROM categories WHERE name = 'Electronics')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'SNY-WH1000XM5');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Men''s Classic Oxford Shirt',
       '100% premium cotton, regular fit, button-down collar. Available in multiple colors. Machine washable.',
       1499.00, 200,
       'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
       'Arrow', 'ARW-SHIRT-OXF-M', true, false,
       (SELECT id FROM categories WHERE name = 'Clothing')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARW-SHIRT-OXF-M');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Women''s Casual Denim Jacket',
       'Mid-weight denim, button front, chest pockets, relaxed fit. Perfect for layering.',
       2999.00, 120,
       'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
       'Levi''s', 'LEV-JACK-DEN-W', true, true,
       (SELECT id FROM categories WHERE name = 'Clothing')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LEV-JACK-DEN-W');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Running Sports Shoes',
       'Lightweight mesh upper, EVA midsole, rubber outsole. Breathable and flexible. Sizes 6-12.',
       3499.00, 180,
       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
       'Nike', 'NKE-SHOE-RUN-01', true, true,
       (SELECT id FROM categories WHERE name = 'Clothing')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NKE-SHOE-RUN-01');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Atomic Habits - James Clear',
       'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times Bestseller. Paperback.',
       499.00, 500,
       'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
       'Penguin Books', 'BK-ATOMIC-HABITS', true, true,
       (SELECT id FROM categories WHERE name = 'Books')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BK-ATOMIC-HABITS');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'The Psychology of Money',
       'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Bestselling personal finance book.',
       399.00, 400,
       'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
       'HarperCollins', 'BK-PSYCH-MONEY', true, false,
       (SELECT id FROM categories WHERE name = 'Books')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BK-PSYCH-MONEY');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Premium Stainless Steel Cookware Set',
       '10-piece set: pots, pans, lids. Tri-ply construction, oven safe to 500°F, dishwasher safe.',
       8999.00, 40,
       'https://images.unsplash.com/photo-1584990347449-a43ccaadd4c5?w=400',
       'Prestige', 'PRE-CKWR-SET10', true, false,
       (SELECT id FROM categories WHERE name = 'Home & Kitchen')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRE-CKWR-SET10');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Smart Air Purifier with HEPA Filter',
       'Covers 500 sq ft, true HEPA + activated carbon, Wi-Fi & app control, auto mode, sleep mode.',
       15999.00, 25,
       'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
       'Dyson', 'DYS-AIRPUR-SMART', true, true,
       (SELECT id FROM categories WHERE name = 'Home & Kitchen')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DYS-AIRPUR-SMART');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Professional Yoga Mat 6mm',
       'Extra-thick 6mm cushioning, non-slip surface, eco-friendly TPE material. Includes carry strap.',
       1299.00, 150,
       'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
       'Manduka', 'MDK-YOGA-MAT6', true, false,
       (SELECT id FROM categories WHERE name = 'Sports & Outdoors')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDK-YOGA-MAT6');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Adjustable Dumbbell Set 5-52.5 lbs',
       'Select weight with a turn of the dial. Replaces 15 sets of weights. Compact design with storage tray.',
       24999.00, 15,
       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
       'Bowflex', 'BWF-DUMBBELL-ADJ', true, false,
       (SELECT id FROM categories WHERE name = 'Sports & Outdoors')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BWF-DUMBBELL-ADJ');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Vitamin C Face Serum 30ml',
       '20% Vitamin C with hyaluronic acid and niacinamide. Brightens, firms, and evens skin tone.',
       899.00, 300,
       'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
       'The Ordinary', 'ORD-VITC-SRM30', true, false,
       (SELECT id FROM categories WHERE name = 'Beauty & Health')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ORD-VITC-SRM30');

INSERT INTO products (name, description, price, stock_quantity, image_url, brand, sku, active, featured, category_id)
SELECT 'Wireless Bluetooth Earbuds TWS',
       'True wireless stereo, 6hr battery (24hr with case), IPX5 waterproof, touch controls, voice assistant.',
       2499.00, 100,
       'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
       'boAt', 'BOT-TWS-AIRDOPES', true, true,
       (SELECT id FROM categories WHERE name = 'Electronics')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BOT-TWS-AIRDOPES');
