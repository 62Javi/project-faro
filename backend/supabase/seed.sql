-- FARO - Demo Seed Data for Supabase
INSERT INTO restaurants (id, name, slug, description, logo_url, owner_id, address, phone, currency, tables_count)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Faro - Cocina de Mar & Fuego',
    'faro-demo',
    'Sabores auténticos, pesca fresca del día y carnes maduradas a las brasas.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
    'user_clerk_owner_demo',
    'Av. Costanera 1420, La Plata',
    '+54 221 555-0199',
    'ARS',
    10
) ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, restaurant_id, name, description, icon, display_order)
VALUES 
('b1111111-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Entradas & Tapeo', 'Para comenzar a compartir', 'Utensils', 1),
('b2222222-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Platos Principales', 'Especialidades de mar y parrilla', 'Flame', 2),
('b3333333-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Postres Artesanales', 'El toque dulce de la casa', 'IceCream', 3),
('b4444444-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bebidas & Coctelería', 'Vinos seleccionados y cócteles de autor', 'GlassWater', 4)
ON CONFLICT DO NOTHING;
