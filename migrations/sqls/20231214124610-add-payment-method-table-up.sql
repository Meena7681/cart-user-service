CREATE TABLE "payment_methods" (
        "id" bigserial PRIMARY KEY,
        "user_id"  bigint NOT NULL,
        "bank_account" bigint,
        "swift_code" varchar,
        "payment_type" varchar,
        "created_at" timestamptz NOT NULL DEFAULT (now()),
        "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "payment_methods" ("bank_account");
CREATE INDEX ON "payment_methods" ("user_id");
CREATE INDEX ON "payment_methods" ("payment_type");

--Add Relations
ALTER TABLE "payment_methods" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("user_id");