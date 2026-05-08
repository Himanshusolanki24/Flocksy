CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'farmer',
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    house_count INT DEFAULT 1,
    total_capacity INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poultry_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    breed TEXT,
    batch_code TEXT NOT NULL,
    flock_size INT NOT NULL,
    age_in_days INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disease_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES poultry_batches(id) ON DELETE CASCADE,
    predicted_disease TEXT NOT NULL,
    confidence NUMERIC(5, 4) NOT NULL,
    symptoms TEXT,
    image_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES poultry_batches(id) ON DELETE CASCADE,
    feed_type TEXT NOT NULL,
    protein_percent NUMERIC(5, 2),
    energy_kcal NUMERIC(8, 2),
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_record_id UUID NOT NULL REFERENCES disease_records(id) ON DELETE CASCADE,
    medicine_name TEXT,
    dosage TEXT,
    withdrawal_period TEXT,
    notes TEXT,
    administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_batches_farm_id ON poultry_batches(farm_id);
CREATE INDEX IF NOT EXISTS idx_disease_records_batch_id ON disease_records(batch_id);
CREATE INDEX IF NOT EXISTS idx_treatment_logs_record_id ON treatment_logs(disease_record_id);
