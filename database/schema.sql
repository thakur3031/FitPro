-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- User (Trainer) Table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    bio TEXT,
    profile_picture_url VARCHAR(255),
    specialization VARCHAR(255), -- e.g., Weight Loss, Muscle Gain, Sports Performance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_User
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Client Table
CREATE TABLE Client (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    date_of_birth DATE,
    address TEXT,
    profile_picture_url VARCHAR(255),
    health_notes TEXT, -- Allergies, pre-existing conditions, medications
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_Client
BEFORE UPDATE ON Client
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ClientGoal Table
CREATE TABLE ClientGoal (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(id) ON DELETE CASCADE,
    goal_description TEXT NOT NULL,
    target_date DATE,
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., Pending, In Progress, Achieved, Not Achieved
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_ClientGoal
BEFORE UPDATE ON ClientGoal
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ClientMeasurement Table
CREATE TABLE ClientMeasurement (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(id) ON DELETE CASCADE,
    measurement_date TIMESTAMPTZ DEFAULT NOW(),
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,1),
    body_fat_percentage NUMERIC(4,2),
    waist_circumference_cm NUMERIC(5,2),
    chest_circumference_cm NUMERIC(5,2),
    hip_circumference_cm NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_ClientMeasurement
BEFORE UPDATE ON ClientMeasurement
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Appointment Table
CREATE TABLE Appointment (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES Client(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    appointment_type VARCHAR(100), -- e.g., Consultation, Training Session, Check-in
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled', -- e.g., Scheduled, Completed, Cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_Appointment
BEFORE UPDATE ON Appointment
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- NutritionPlan Table
CREATE TABLE NutritionPlan (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    notes TEXT, -- General notes for the plan
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_NutritionPlan
BEFORE UPDATE ON NutritionPlan
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- NutritionPlanItem Table
CREATE TABLE NutritionPlanItem (
    id SERIAL PRIMARY KEY,
    nutrition_plan_id INTEGER NOT NULL REFERENCES NutritionPlan(id) ON DELETE CASCADE,
    meal_type VARCHAR(100), -- e.g., Breakfast, Lunch, Dinner, Snack
    food_item VARCHAR(255) NOT NULL,
    quantity VARCHAR(100), -- e.g., 100g, 1 cup, 1 piece
    calories INTEGER,
    protein_g NUMERIC(5,2),
    carbohydrates_g NUMERIC(5,2),
    fats_g NUMERIC(5,2),
    notes TEXT,
    day_of_week VARCHAR(20), -- e.g., Monday, Tuesday, All Days
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_NutritionPlanItem
BEFORE UPDATE ON NutritionPlanItem
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- FitnessPlan Table
CREATE TABLE FitnessPlan (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    notes TEXT, -- General notes for the fitness plan
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_FitnessPlan
BEFORE UPDATE ON FitnessPlan
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- FitnessPlanItem Table
CREATE TABLE FitnessPlanItem (
    id SERIAL PRIMARY KEY,
    fitness_plan_id INTEGER NOT NULL REFERENCES FitnessPlan(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    duration_minutes INTEGER,
    rest_period_seconds INTEGER,
    notes TEXT, -- e.g., specific instructions, tempo
    day_of_week VARCHAR(20), -- e.g., Monday, Tuesday, All Days
    category VARCHAR(100), -- e.g., Warm-up, Strength, Cardio, Cool-down
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_FitnessPlanItem
BEFORE UPDATE ON FitnessPlanItem
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
