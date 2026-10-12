CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, attendance_date)
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'attendance'
        AND column_name = 'date'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'attendance'
        AND column_name = 'attendance_date'
    ) THEN
        ALTER TABLE attendance
        RENAME COLUMN date TO attendance_date;
    END IF;
END $$;

ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS attendance_date DATE DEFAULT CURRENT_DATE;

ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE attendance
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE attendance
SET attendance_date = CURRENT_DATE
WHERE attendance_date IS NULL;

UPDATE attendance
SET status = 'Present'
WHERE status IS NULL;

ALTER TABLE attendance
ALTER COLUMN attendance_date SET NOT NULL;

ALTER TABLE attendance
ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'attendance_status_check'
    ) THEN
        ALTER TABLE attendance
        ADD CONSTRAINT attendance_status_check
        CHECK (status IN ('Present', 'Absent', 'Late', 'Leave'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'attendance_employee_date_unique'
    ) THEN
        ALTER TABLE attendance
        ADD CONSTRAINT attendance_employee_date_unique
        UNIQUE (employee_id, attendance_date);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_attendance_date
ON attendance(attendance_date DESC);

CREATE INDEX IF NOT EXISTS idx_attendance_employee
ON attendance(employee_id);

CREATE INDEX IF NOT EXISTS idx_attendance_status
ON attendance(status);
