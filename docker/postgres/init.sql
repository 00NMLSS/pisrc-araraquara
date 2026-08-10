CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Partitioned Users Table (HASH Partitioning by ID)
CREATE TABLE users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id, email)
) PARTITION BY HASH (id);

CREATE TABLE users_part_0 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE users_part_1 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE users_part_2 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE users_part_3 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catalog Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catalog Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    stock_quantity INT NOT NULL DEFAULT 0,
    is_organic BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partitioned Orders Table (RANGE Partitioning by Order Date)
CREATE TABLE orders (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_orders PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2026_q1 PARTITION OF orders FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');
CREATE TABLE orders_2026_q2 PARTITION OF orders FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');
CREATE TABLE orders_2026_q3 PARTITION OF orders FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE orders_2026_q4 PARTITION OF orders FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');
CREATE TABLE orders_future PARTITION OF orders FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2030-01-01 00:00:00+00');

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Initial Categories Seed Data
INSERT INTO categories (id, name, slug, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'Frutas Frescas', 'frutas', 'Frutas colhidas no ponto certo de maturação'),
('c2222222-2222-2222-2222-222222222222', 'Verduras e Folhas', 'verduras', 'Verduras orgânicas e crocantes'),
('c3333333-3333-3333-3333-333333333333', 'Legumes e Tubérculos', 'legumes', 'Legumes selecionados para sua mesa'),
('c4444444-4444-4444-4444-444444444444', 'Temperos e Ervas', 'temperos', 'Ervas aromáticas para dar sabor especial');

-- Initial Products Seed Data
INSERT INTO products (id, category_id, name, slug, description, price, unit, stock_quantity, is_organic, image_url) VALUES
('p1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Maçã Fuji Orgânica', 'maca-fuji-organica', 'Maçãs doces e suculentas produtoras locais.', 8.90, 'kg', 150, true, '/images/maca.jpg'),
('p2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Banana Prata Orgânica', 'banana-prata-organica', 'Bananas ricas em potássio e sem agrotóxicos.', 6.50, 'kg', 200, true, '/images/banana.jpg'),
('p3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Alface Crespa Orgânica', 'alface-crespa-organica', 'Maço de alface fresca colhida no dia.', 3.90, 'maço', 80, true, '/images/alface.jpg'),
('p4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Tomate Italiano Orgânico', 'tomate-italiano-organico', 'Tomates maduros ideais para saladas e molhos.', 9.80, 'kg', 120, true, '/images/tomate.jpg'),
('p5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'Cenoura Orgânica', 'cenoura-organica', 'Cenouras crocantes e selecionadas.', 5.40, 'kg', 100, true, '/images/cenoura.jpg'),
('p6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444', 'Manjericão Fresco', 'manjericao-fresco', 'Erva aromática para seus pratos.', 4.20, 'maço', 50, true, '/images/manjericao.jpg');
