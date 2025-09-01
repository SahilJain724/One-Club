CREATE USER IF NOT EXISTS 'sahil'@'%' IDENTIFIED BY 'Sahil@123';

GRANT ALL PRIVILEGES ON products_inventory_db.* TO 'sahil'@'%';
GRANT ALL PRIVILEGES ON carts_db.* TO 'sahil'@'%';
GRANT ALL PRIVILEGES ON orders_db.* TO 'sahil'@'%';
GRANT ALL PRIVILEGES ON users_db.* TO 'sahil'@'%';
GRANT ALL PRIVILEGES ON payments_db.* TO 'sahil'@'%';

FLUSH PRIVILEGES;