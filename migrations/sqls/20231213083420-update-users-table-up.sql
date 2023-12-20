ALTER TABLE users
ADD COLUMN stripe_id varchar(255),
ADD COLUMN payment_id varchar(255);