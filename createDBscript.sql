-- Create database
DROP DATABASE IF EXISTS cafe_ordering_app;
CREATE DATABASE cafe_ordering_app;
USE cafe_ordering_app;

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(255)
);

-- Cafes table
CREATE TABLE Cafes (
    cafe_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    website_url VARCHAR(255),
    profile_image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0
);

-- CafeOwners table
CREATE TABLE CafeOwners (
    owner_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- CafeHours table
CREATE TABLE CafeHours (
    hours_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    day_of_week INT NOT NULL, -- 1=Monday, 7=Sunday
    opening_time TIME,
    closing_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id)
);

-- Menu table
CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id)
);

-- Categories table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- MenuItems table
CREATE TABLE MenuItems (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    preparation_time_mins INT DEFAULT 5,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- MenuItemCategories mapping table
CREATE TABLE MenuItemCategories (
    category_mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- MenuItemSizes table
CREATE TABLE MenuItemSizes (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
);

-- MenuItemCustomizations table
CREATE TABLE MenuItemCustomizations (
    customization_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
);

-- Orders table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    pickup_time DATETIME,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    special_instructions TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id)
);

-- OrderItems table
CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    size_id INT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id),
    FOREIGN KEY (size_id) REFERENCES MenuItemSizes(size_id)
);

-- OrderItemCustomizations table
CREATE TABLE OrderItemCustomizations (
    order_cust_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    customization_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_item_id) REFERENCES OrderItems(order_item_id),
    FOREIGN KEY (customization_id) REFERENCES MenuItemCustomizations(customization_id)
);

-- Reviews table
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- SpecialOffers table
CREATE TABLE SpecialOffers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED
    promo_code VARCHAR(50),
    usage_limit INT,
    current_usage INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id)
);

-- Favorites table
CREATE TABLE Favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id)
);

-- UserPreferences table
CREATE TABLE UserPreferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    dietary_vegan BOOLEAN DEFAULT FALSE,
    dietary_vegetarian BOOLEAN DEFAULT FALSE,
    dietary_gluten_free BOOLEAN DEFAULT FALSE,
    dietary_dairy_free BOOLEAN DEFAULT FALSE,
    favorite_milk_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- CafeAnalytics table
CREATE TABLE CafeAnalytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    date DATE NOT NULL,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    unique_customers INT DEFAULT 0,
    new_customers INT DEFAULT 0,
    avg_order_value DECIMAL(10, 2) DEFAULT 0,
    peak_hour_start TIME,
    peak_hour_end TIME,
    most_popular_item_id INT,
    FOREIGN KEY (cafe_id) REFERENCES Cafes(cafe_id),
    FOREIGN KEY (most_popular_item_id) REFERENCES MenuItems(item_id)
);

-- Insert mock data

-- Categories
INSERT INTO Categories (name, description) VALUES
('Coffee', 'Coffee-based beverages'),
('Tea', 'Tea-based beverages'),
('Matcha', 'Matcha-based beverages and treats'),
('Bakery', 'Fresh-baked goods'),
('Breakfast', 'Morning food items'),
('Sandwiches', 'Lunch and snack sandwiches'),
('Cold Drinks', 'Iced and refreshing beverages'),
('Hot Drinks', 'Warm beverages beyond coffee and tea');

-- Users
INSERT INTO Users (email, password_hash, full_name, phone_number, created_at, last_login, is_active, profile_image_url) VALUES
('sarah.johnson@example.com', 'hashed_password_1', 'Sarah Johnson', '310-555-1234', '2024-01-15 10:30:00', '2025-03-21 08:15:00', TRUE, 'https://example.com/profiles/sarah.jpg'),
('michael.chen@example.com', 'hashed_password_2', 'Michael Chen', '323-555-6789', '2024-02-20 14:45:00', '2025-03-22 07:45:00', TRUE, 'https://example.com/profiles/michael.jpg'),
('olivia.rodriguez@example.com', 'hashed_password_3', 'Olivia Rodriguez', '213-555-4321', '2024-03-10 09:15:00', '2025-03-20 16:30:00', TRUE, 'https://example.com/profiles/olivia.jpg');

-- Cafes
INSERT INTO Cafes (name, description, address, latitude, longitude, phone_number, email, website_url, profile_image_url, is_active, created_at, avg_rating, total_reviews) VALUES
('Sunset Brew', 'Artisanal coffee shop specializing in single-origin beans and house-made pastries', '1234 Sunset Blvd, Los Angeles, CA 90026', 34.0763, -118.2378, '213-555-8901', 'hello@sunsetbrew.com', 'https://sunsetbrew.com', 'https://example.com/cafes/sunset.jpg', TRUE, '2024-01-01 08:00:00', 4.7, 128),
('Highland Roasters', 'Community-focused café with spacious seating and craft coffee beverages', '5678 Highland Ave, Los Angeles, CA 90068', 34.1016, -118.3295, '323-555-2345', 'info@highlandroasters.com', 'https://highlandroasters.com', 'https://example.com/cafes/highland.jpg', TRUE, '2024-02-15 09:00:00', 4.5, 87),
('Venice Bean', 'Beachside coffeehouse with organic options and locally sourced ingredients', '910 Abbot Kinney Blvd, Venice, CA 90291', 33.9905, -118.4651, '310-555-6789', 'hello@venicebean.com', 'https://venicebean.com', 'https://example.com/cafes/venice.jpg', TRUE, '2024-03-01 07:30:00', 4.8, 156);

-- CafeOwners
INSERT INTO CafeOwners (cafe_id, user_id, role, added_at) VALUES
(1, 1, 'Manager', '2024-01-01 08:00:00'),
(2, 2, 'Owner', '2024-02-15 09:00:00'),
(3, 3, 'Manager', '2024-03-01 07:30:00');

-- CafeHours - for all 3 cafes, all 7 days of the week
-- Sunset Brew
INSERT INTO CafeHours (cafe_id, day_of_week, opening_time, closing_time, is_closed) VALUES
(1, 1, '07:00:00', '18:00:00', FALSE), -- Monday
(1, 2, '07:00:00', '18:00:00', FALSE), -- Tuesday
(1, 3, '07:00:00', '18:00:00', FALSE), -- Wednesday
(1, 4, '07:00:00', '18:00:00', FALSE), -- Thursday
(1, 5, '07:00:00', '20:00:00', FALSE), -- Friday
(1, 6, '08:00:00', '20:00:00', FALSE), -- Saturday
(1, 7, '08:00:00', '17:00:00', FALSE); -- Sunday

-- Highland Roasters
INSERT INTO CafeHours (cafe_id, day_of_week, opening_time, closing_time, is_closed) VALUES
(2, 1, '06:30:00', '19:00:00', FALSE), -- Monday
(2, 2, '06:30:00', '19:00:00', FALSE), -- Tuesday
(2, 3, '06:30:00', '19:00:00', FALSE), -- Wednesday
(2, 4, '06:30:00', '19:00:00', FALSE), -- Thursday
(2, 5, '06:30:00', '21:00:00', FALSE), -- Friday
(2, 6, '07:00:00', '21:00:00', FALSE), -- Saturday
(2, 7, '07:00:00', '18:00:00', FALSE); -- Sunday

-- Venice Bean
INSERT INTO CafeHours (cafe_id, day_of_week, opening_time, closing_time, is_closed) VALUES
(3, 1, '07:00:00', '20:00:00', FALSE), -- Monday
(3, 2, '07:00:00', '20:00:00', FALSE), -- Tuesday
(3, 3, '07:00:00', '20:00:00', FALSE), -- Wednesday
(3, 4, '07:00:00', '20:00:00', FALSE), -- Thursday
(3, 5, '07:00:00', '22:00:00', FALSE), -- Friday
(3, 6, '07:00:00', '22:00:00', FALSE), -- Saturday
(3, 7, '07:00:00', '20:00:00', FALSE); -- Sunday

-- Menu for each cafe
INSERT INTO Menu (cafe_id, name, description, is_active) VALUES
(1, 'Sunset Brew Main Menu', 'Our full selection of beverages and food items', TRUE),
(2, 'Highland Roasters Menu', 'Craft coffee and house specialties', TRUE),
(3, 'Venice Bean Offerings', 'Organic coffee, tea, and beach-inspired treats', TRUE);

-- Menu Items for Sunset Brew
INSERT INTO MenuItems (menu_id, name, description, base_price, is_available, image_url, preparation_time_mins) VALUES
(1, 'House Blend Coffee', 'Our signature blend with notes of chocolate and caramel', 3.75, TRUE, 'https://example.com/items/house-blend.jpg', 3),
(1, 'Sunset Latte', 'Espresso with steamed milk and house-made vanilla syrup', 5.25, TRUE, 'https://example.com/items/sunset-latte.jpg', 5),
(1, 'Matcha Green Tea Latte', 'Premium ceremonial grade matcha with steamed milk', 5.75, TRUE, 'https://example.com/items/matcha-latte.jpg', 4),
(1, 'Almond Croissant', 'Flaky croissant filled with almond cream', 4.50, TRUE, 'https://example.com/items/almond-croissant.jpg', 1),
(1, 'Avocado Toast', 'Multigrain toast with avocado, radish, and microgreens', 9.50, TRUE, 'https://example.com/items/avo-toast.jpg', 7);

-- Menu Items for Highland Roasters
INSERT INTO MenuItems (menu_id, name, description, base_price, is_available, image_url, preparation_time_mins) VALUES
(2, 'Single Origin Pour Over', 'Meticulously brewed single origin coffee of the day', 4.75, TRUE, 'https://example.com/items/pour-over.jpg', 6),
(2, 'Highland Mocha', 'Espresso with steamed milk and artisanal chocolate', 5.50, TRUE, 'https://example.com/items/highland-mocha.jpg', 5),
(2, 'Chai Tea Latte', 'House-made chai blend with steamed milk', 4.95, TRUE, 'https://example.com/items/chai-latte.jpg', 4),
(2, 'Blueberry Muffin', 'Freshly baked muffin with organic blueberries', 3.95, TRUE, 'https://example.com/items/blueberry-muffin.jpg', 1),
(2, 'Breakfast Burrito', 'Egg, cheese, potato, and roasted veggies in a flour tortilla', 10.50, TRUE, 'https://example.com/items/breakfast-burrito.jpg', 8);

-- Menu Items for Venice Bean
INSERT INTO MenuItems (menu_id, name, description, base_price, is_available, image_url, preparation_time_mins) VALUES
(3, 'Cold Brew Coffee', 'Smooth, 18-hour steeped cold brew', 4.95, TRUE, 'https://example.com/items/cold-brew.jpg', 2),
(3, 'Venice Cappuccino', 'Perfect balance of espresso, steamed milk, and foam', 4.75, TRUE, 'https://example.com/items/cappuccino.jpg', 4),
(3, 'Blue Matcha Latte', 'Butterfly pea flower matcha with oat milk', 6.25, TRUE, 'https://example.com/items/blue-matcha.jpg', 5),
(3, 'Vegan Banana Bread', 'Moist banana bread made with coconut oil', 4.25, TRUE, 'https://example.com/items/banana-bread.jpg', 1),
(3, 'Acai Bowl', 'Organic acai blend topped with fresh fruit and granola', 11.95, TRUE, 'https://example.com/items/acai-bowl.jpg', 8);

-- Menu Item Categories
-- Sunset Brew items
INSERT INTO MenuItemCategories (item_id, category_id) VALUES
(1, 1), -- House Blend Coffee -> Coffee
(2, 1), -- Sunset Latte -> Coffee
(3, 3), -- Matcha Green Tea Latte -> Matcha
(4, 4), -- Almond Croissant -> Bakery
(5, 5); -- Avocado Toast -> Breakfast

-- Highland Roasters items
INSERT INTO MenuItemCategories (item_id, category_id) VALUES
(6, 1), -- Single Origin Pour Over -> Coffee
(7, 1), -- Highland Mocha -> Coffee
(8, 2), -- Chai Tea Latte -> Tea
(9, 4), -- Blueberry Muffin -> Bakery
(10, 5); -- Breakfast Burrito -> Breakfast

-- Venice Bean items
INSERT INTO MenuItemCategories (item_id, category_id) VALUES
(11, 1), -- Cold Brew Coffee -> Coffee
(11, 7), -- Cold Brew Coffee -> Cold Drinks
(12, 1), -- Venice Cappuccino -> Coffee
(13, 3), -- Blue Matcha Latte -> Matcha
(14, 4), -- Vegan Banana Bread -> Bakery
(15, 5); -- Acai Bowl -> Breakfast

-- Menu Item Sizes
-- Coffee sizes for all cafes
INSERT INTO MenuItemSizes (item_id, name, price_adjustment) VALUES
-- Sunset Brew
(1, 'Small', 0.00),
(1, 'Medium', 0.75),
(1, 'Large', 1.50),
(2, 'Small', 0.00),
(2, 'Medium', 0.75),
(2, 'Large', 1.50),
(3, 'Small', 0.00),
(3, 'Medium', 0.75),
(3, 'Large', 1.50),

-- Highland Roasters
(6, 'Small', 0.00),
(6, 'Medium', 0.75),
(6, 'Large', 1.50),
(7, 'Small', 0.00),
(7, 'Medium', 0.75),
(7, 'Large', 1.50),
(8, 'Small', 0.00),
(8, 'Medium', 0.75),
(8, 'Large', 1.50),

-- Venice Bean
(11, 'Small', 0.00),
(11, 'Medium', 0.75),
(11, 'Large', 1.50),
(12, 'Small', 0.00),
(12, 'Medium', 0.75),
(12, 'Large', 1.50),
(13, 'Small', 0.00),
(13, 'Medium', 0.75),
(13, 'Large', 1.50);

-- Menu Item Customizations
-- Milk options and extras for coffee drinks
INSERT INTO MenuItemCustomizations (item_id, name, description, price_adjustment, is_available) VALUES
-- Sunset Brew customizations
(1, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(1, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(1, 'Extra Shot', 'Add an extra shot of espresso', 1.25, TRUE),
(2, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(2, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(2, 'Extra Shot', 'Add an extra shot of espresso', 1.25, TRUE),
(2, 'Vanilla Syrup', 'Add vanilla syrup', 0.50, TRUE),
(3, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(3, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(3, 'Extra Matcha', 'Add extra matcha powder', 1.00, TRUE),

-- Highland Roasters customizations
(6, 'Honey', 'Add local honey', 0.50, TRUE),
(7, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(7, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(7, 'Extra Shot', 'Add an extra shot of espresso', 1.25, TRUE),
(7, 'Caramel', 'Add caramel drizzle', 0.50, TRUE),
(8, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(8, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(8, 'Extra Spicy', 'Add extra chai spice', 0.50, TRUE),

-- Venice Bean customizations
(11, 'Vanilla Cold Foam', 'Add house-made vanilla cold foam', 1.25, TRUE),
(11, 'Caramel Swirl', 'Add caramel swirl', 0.75, TRUE),
(12, 'Oat Milk', 'Replace with oat milk', 0.75, TRUE),
(12, 'Almond Milk', 'Replace with almond milk', 0.75, TRUE),
(12, 'Extra Shot', 'Add an extra shot of espresso', 1.25, TRUE),
(13, 'CBD Oil', 'Add CBD oil boost', 3.00, TRUE),
(13, 'Extra Matcha', 'Add extra matcha powder', 1.00, TRUE);

-- Orders
INSERT INTO Orders (user_id, cafe_id, order_time, pickup_time, status, subtotal, tax, total, payment_method, payment_status, special_instructions) VALUES
-- Sarah's orders
(1, 1, '2025-03-15 08:30:00', '2025-03-15 08:45:00', 'COMPLETED', 10.25, 0.95, 11.20, 'CREDIT_CARD', 'PAID', 'Extra hot, please'),
(1, 3, '2025-03-18 10:15:00', '2025-03-18 10:30:00', 'COMPLETED', 16.20, 1.50, 17.70, 'CREDIT_CARD', 'PAID', NULL),
-- Michael's orders
(2, 2, '2025-03-16 07:45:00', '2025-03-16 08:00:00', 'COMPLETED', 15.45, 1.43, 16.88, 'APPLE_PAY', 'PAID', 'No straw needed'),
(2, 1, '2025-03-20 12:30:00', '2025-03-20 12:45:00', 'COMPLETED', 14.00, 1.30, 15.30, 'APPLE_PAY', 'PAID', NULL),
-- Olivia's orders
(3, 3, '2025-03-17 16:00:00', '2025-03-17 16:15:00', 'COMPLETED', 21.20, 1.96, 23.16, 'CREDIT_CARD', 'PAID', 'Allergic to nuts'),
(3, 2, '2025-03-21 09:00:00', '2025-03-21 09:15:00', 'COMPLETED', 9.70, 0.90, 10.60, 'CREDIT_CARD', 'PAID', NULL),
-- Today's orders
(1, 1, '2025-03-22 08:00:00', '2025-03-22 08:15:00', 'READY', 12.75, 1.18, 13.93, 'CREDIT_CARD', 'PAID', NULL),
(2, 2, '2025-03-22 08:30:00', '2025-03-22 08:45:00', 'PREPARING', 18.25, 1.69, 19.94, 'APPLE_PAY', 'PAID', 'Extra napkins please'),
(3, 3, '2025-03-22 09:00:00', '2025-03-22 09:15:00', 'CONFIRMED', 17.45, 1.62, 19.07, 'CREDIT_CARD', 'PAID', NULL);

-- Order Items
INSERT INTO OrderItems (order_id, item_id, size_id, quantity, unit_price, total_price) VALUES
-- Sarah's first order
(1, 2, 13, 1, 6.00, 6.00), -- Sunset Latte (Medium)
(1, 4, NULL, 1, 4.25, 4.25), -- Almond Croissant

-- Sarah's second order
(2, 11, 19, 1, 5.70, 5.70), -- Cold Brew Coffee (Medium)
(2, 15, NULL, 1, 10.50, 10.50), -- Acai Bowl

-- Michael's first order
(3, 7, 15, 1, 6.25, 6.25), -- Highland Mocha (Medium)
(3, 10, NULL, 1, 9.20, 9.20), -- Breakfast Burrito

-- Michael's second order
(4, 3, 7, 1, 5.75, 5.75), -- Matcha Green Tea Latte (Small)
(4, 5, NULL, 1, 8.25, 8.25), -- Avocado Toast

-- Olivia's first order
(5, 12, 22, 1, 5.50, 5.50), -- Venice Cappuccino (Medium)
(5, 13, 25, 1, 7.00, 7.00), -- Blue Matcha Latte (Medium)
(5, 14, NULL, 2, 4.25, 8.50), -- Vegan Banana Bread (2)

-- Olivia's second order
(6, 8, 16, 1, 5.70, 5.70), -- Chai Tea Latte (Medium)
(6, 9, NULL, 1, 4.00, 4.00), -- Blueberry Muffin

-- Today's orders
-- Sarah's order
(7, 1, 2, 1, 4.50, 4.50), -- House Blend Coffee (Medium)
(7, 5, NULL, 1, 8.25, 8.25), -- Avocado Toast

-- Michael's order
(8, 7, 15, 2, 6.25, 12.50), -- Highland Mocha (Medium) x2
(8, 9, NULL, 1, 3.95, 3.95), -- Blueberry Muffin
(8, 6, 10, 1, 4.75, 4.75), -- Single Origin Pour Over (Small)

-- Olivia's order
(9, 13, 25, 1, 7.00, 7.00), -- Blue Matcha Latte (Medium)
(9, 11, 20, 1, 6.45, 6.45), -- Cold Brew Coffee (Large)
(9, 14, NULL, 1, 4.00, 4.00); -- Vegan Banana Bread

-- Order Item Customizations
INSERT INTO OrderItemCustomizations (order_item_id, customization_id, quantity) VALUES
-- Sarah's first order - Sunset Latte with Oat Milk
(1, 4, 1),

-- Michael's first order - Highland Mocha with Extra Shot
(5, 14, 1),

-- Olivia's first order - Blue Matcha Latte with CBD Oil
(7, 24, 1),

-- Today's orders
-- Sarah's order - House Blend Coffee with Almond Milk
(11, 2, 1),

-- Michael's order - Highland Mocha with Caramel
(13, 15, 2),

-- Olivia's order - Blue Matcha Latte with Extra Matcha
(17, 25, 1),
-- Olivia's order - Cold Brew with Vanilla Cold Foam
(18, 19, 1);

-- Reviews (continued)
INSERT INTO Reviews (user_id, cafe_id, order_id, rating, comment, created_at, is_verified_purchase) VALUES
-- Sarah's reviews
(1, 1, 1, 5, 'The Sunset Latte was perfect and the almond croissant was flaky and delicious. Great morning stop!', '2025-03-15 10:30:00', TRUE),
(1, 3, 2, 4, 'Love the Cold Brew here, so smooth. The acai bowl was fresh but could use more granola.', '2025-03-18 12:15:00', TRUE),

-- Michael's reviews
(2, 2, 3, 5, 'Highland Roasters has the best mocha in LA. Their breakfast burrito is amazing too!', '2025-03-16 09:30:00', TRUE),
(2, 1, 4, 4, 'The matcha was good, but the avocado toast was the star - so fresh!', '2025-03-20 14:00:00', TRUE),

-- Olivia's reviews
(3, 3, 5, 5, 'The blue matcha latte is Instagram-worthy and tastes as good as it looks. Vegan banana bread is to die for!', '2025-03-17 17:30:00', TRUE),
(3, 2, 6, 4, 'Solid chai latte, nice and spicy. Blueberry muffin was a bit dry but still tasty.', '2025-03-21 10:45:00', TRUE);

-- Special Offers
INSERT INTO SpecialOffers (cafe_id, title, description, start_date, end_date, discount_amount, discount_type, promo_code, usage_limit, current_usage, is_active) VALUES
-- Sunset Brew offers
(1, 'Morning Happy Hour', '20% off all coffee drinks between 7-9am', '2025-03-01 00:00:00', '2025-03-31 23:59:59', 20.00, 'PERCENTAGE', 'SUNRISE20', 500, 178, TRUE),
(1, 'Pastry Bundle', 'Buy any coffee, get a pastry for $2', '2025-03-15 00:00:00', '2025-04-15 23:59:59', 2.00, 'FIXED', 'PASTRY2', 300, 45, TRUE),

-- Highland Roasters offers
(2, 'First Time Customer', '$5 off your first order of $15 or more', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 5.00, 'FIXED', 'WELCOME5', 1000, 346, TRUE),
(2, 'Weekend Special', 'Buy one get one 50% off on all breakfast items', '2025-03-01 00:00:00', '2025-03-31 23:59:59', 50.00, 'PERCENTAGE', 'WEEKEND50', 200, 89, TRUE),

-- Venice Bean offers
(3, 'Beach Day Bundle', 'Cold brew and acai bowl combo for $15', '2025-03-01 00:00:00', '2025-09-30 23:59:59', 3.95, 'FIXED', 'BEACHDAY', 500, 112, TRUE),
(3, 'Matcha Madness', '15% off all matcha drinks on Mondays', '2025-03-01 00:00:00', '2025-03-31 23:59:59', 15.00, 'PERCENTAGE', 'MATCHAMONDAY', 200, 67, TRUE);

-- Favorites
INSERT INTO Favorites (user_id, cafe_id, added_at) VALUES
(1, 1, '2025-03-01 09:15:00'), -- Sarah likes Sunset Brew
(1, 3, '2025-03-18 10:30:00'), -- Sarah likes Venice Bean
(2, 2, '2025-02-20 08:00:00'), -- Michael likes Highland Roasters
(3, 3, '2025-03-02 16:30:00'); -- Olivia likes Venice Bean

-- User Preferences
INSERT INTO UserPreferences (user_id, category_id, dietary_vegan, dietary_vegetarian, dietary_gluten_free, dietary_dairy_free, favorite_milk_type) VALUES
(1, 1, FALSE, TRUE, FALSE, FALSE, 'Oat'),     -- Sarah: Coffee category, vegetarian, prefers oat milk
(2, 5, FALSE, FALSE, FALSE, FALSE, 'Regular'), -- Michael: Breakfast category, no dietary restrictions
(3, 3, TRUE, TRUE, FALSE, TRUE, 'Almond');     -- Olivia: Matcha category, vegan, dairy-free, prefers almond milk

-- Cafe Analytics
INSERT INTO CafeAnalytics (cafe_id, date, total_orders, total_revenue, unique_customers, new_customers, avg_order_value, peak_hour_start, peak_hour_end, most_popular_item_id) VALUES
-- Sunset Brew analytics
(1, '2025-03-15', 42, 568.75, 38, 5, 13.54, '08:00:00', '10:00:00', 2),
(1, '2025-03-16', 35, 472.50, 30, 3, 13.50, '09:00:00', '11:00:00', 2),
(1, '2025-03-17', 38, 512.25, 34, 4, 13.48, '08:00:00', '10:00:00', 1),
(1, '2025-03-18', 40, 540.80, 36, 2, 13.52, '08:00:00', '10:00:00', 2),
(1, '2025-03-19', 45, 607.50, 41, 6, 13.50, '08:00:00', '10:00:00', 3),
(1, '2025-03-20', 47, 634.50, 43, 4, 13.50, '08:00:00', '10:00:00', 2),
(1, '2025-03-21', 52, 702.00, 48, 7, 13.50, '08:00:00', '10:00:00', 2),

-- Highland Roasters analytics
(2, '2025-03-15', 38, 551.00, 35, 4, 14.50, '07:00:00', '09:00:00', 7),
(2, '2025-03-16', 45, 652.50, 40, 5, 14.50, '10:00:00', '12:00:00', 7),
(2, '2025-03-17', 36, 522.00, 33, 3, 14.50, '07:00:00', '09:00:00', 8),
(2, '2025-03-18', 39, 565.50, 36, 4, 14.50, '07:00:00', '09:00:00', 7),
(2, '2025-03-19', 42, 609.00, 38, 5, 14.50, '07:00:00', '09:00:00', 7),
(2, '2025-03-20', 44, 638.00, 41, 3, 14.50, '07:00:00', '09:00:00', 10),
(2, '2025-03-21', 48, 696.00, 45, 6, 14.50, '08:00:00', '10:00:00', 7),

-- Venice Bean analytics
(3, '2025-03-15', 55, 825.00, 48, 7, 15.00, '10:00:00', '12:00:00', 11),
(3, '2025-03-16', 60, 900.00, 52, 8, 15.00, '11:00:00', '13:00:00', 11),
(3, '2025-03-17', 52, 780.00, 45, 6, 15.00, '10:00:00', '12:00:00', 15),
(3, '2025-03-18', 57, 855.00, 50, 5, 15.00, '10:00:00', '12:00:00', 11),
(3, '2025-03-19', 54, 810.00, 48, 6, 15.00, '10:00:00', '12:00:00', 13),
(3, '2025-03-20', 58, 870.00, 51, 7, 15.00, '10:00:00', '12:00:00', 11),
(3, '2025-03-21', 63, 945.00, 55, 8, 15.00, '10:00:00', '12:00:00', 15);

-- Create an index for performance on frequently queried columns
CREATE INDEX idx_menu_items_menu_id ON MenuItems(menu_id);
CREATE INDEX idx_menu_items_categories_item_id ON MenuItemCategories(item_id);
CREATE INDEX idx_menu_items_categories_category_id ON MenuItemCategories(category_id);
CREATE INDEX idx_cafe_latitude_longitude ON Cafes(latitude, longitude);
CREATE INDEX idx_orders_user_id ON Orders(user_id);
CREATE INDEX idx_orders_cafe_id ON Orders(cafe_id);
CREATE INDEX idx_orders_status ON Orders(status);
CREATE INDEX idx_reviews_cafe_id ON Reviews(cafe_id);
CREATE INDEX idx_cafe_analytics_date ON CafeAnalytics(date);
CREATE INDEX idx_cafe_analytics_cafe_id ON CafeAnalytics(cafe_id);
CREATE INDEX idx_cafe_hours_cafe_id_day ON CafeHours(cafe_id, day_of_week);
CREATE INDEX idx_user_preferences_user_id ON UserPreferences(user_id);