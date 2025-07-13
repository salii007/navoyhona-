DROP TABLE IF EXISTS baking_log CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS bakeries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS scheduled_orders CASCADE;
DROP TABLE IF EXISTS locations CASCADE;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(15) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20),
  location_id INTEGER REFERENCES locations(id) 
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bakeries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100)
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  address TEXT
);


CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity NUMERIC
);

CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  driver_id INTEGER REFERENCES users(id),
  delivered_at TIMESTAMP,
  payment_type VARCHAR(20)
);

CREATE TABLE baking_log (
  id SERIAL PRIMARY KEY,
  bakery_id INTEGER REFERENCES bakeries(id),
  product_id INTEGER REFERENCES products(id),
  quantity NUMERIC,
  date DATE,
  driver_id INTEGER REFERENCES users(id)
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL
);


CREATE TABLE scheduled_orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,              -- Zakaz bergan odamning ismi
  phone VARCHAR(20) NOT NULL,              -- Telefon raqami
  address TEXT NOT NULL,                   -- Manzili
  date DATE NOT NULL,                      -- Qaysi kunga zakaz
  time TIME NOT NULL,                      -- Qaysi vaqtda yetkaziladi
  quantity INTEGER NOT NULL,               -- Nechta non
  location_id INTEGER NOT NULL,            -- Qaysi Navoyhona (planshet)ga tegishli
  status VARCHAR(20) DEFAULT 'pending'     -- Zakaz holati: 'pending', 'delivered'
);





