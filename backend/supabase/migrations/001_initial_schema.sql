-- FARO - PostgreSQL Schema for Supabase (Multi-tenant Restaurant Platform)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Restaurants (Tenants)
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    owner_id VARCHAR(255) NOT NULL, -- Clerk User ID
    address TEXT,
    phone VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'ARS',
    tables_count INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Menu Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Utensils',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Dishes & Products
CREATE TABLE IF NOT EXISTS dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    allergens TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    preparation_time_minutes INT DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Restaurant Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number INT NOT NULL,
    status VARCHAR(50) DEFAULT 'disponible',
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- 5. Orders
CREATE TYPE order_status_enum AS ENUM (
    'pendiente_mozo',
    'en_cocina',
    'en_preparacion',
    'listo',
    'entregado',
    'cancelado'
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number INT NOT NULL,
    status order_status_enum DEFAULT 'pendiente_mozo',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    customer_notes TEXT,
    waiter_id VARCHAR(255),
    waiter_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE RESTRICT,
    dish_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read of restaurant menu for QR comensales
CREATE POLICY "Public menu read access" ON dishes FOR SELECT USING (true);
CREATE POLICY "Public categories read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public restaurants read access" ON restaurants FOR SELECT USING (true);

-- Allow public order creation for table comensales
CREATE POLICY "Public order creation" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public order items creation" ON order_items FOR INSERT WITH CHECK (true);
