ALTER TABLE IF EXISTS "payment_methods" DROP CONSTRAINT IF EXISTS "payment_methods_user_id_fkey";
DROP TABLE payment_methods;