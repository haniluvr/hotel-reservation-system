CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_type VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL
);

CREATE TABLE promo_codes (
    code VARCHAR(20) PRIMARY KEY,
    discount DECIMAL(5,2) NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    adults INT NOT NULL,
    children INT NOT NULL,
    promo_code VARCHAR(20),
    FOREIGN KEY (promo_code) REFERENCES promo_codes(code)
);

-- Add sample data
INSERT INTO rooms VALUES (1, 'Deluxe Room', 120.00);
INSERT INTO rooms VALUES (2, 'Standard Room', 130.00);
INSERT INTO promo_codes VALUES ('SENIOR10', 10, 'Senior Discount');