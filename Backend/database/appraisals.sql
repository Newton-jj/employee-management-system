CREATE TABLE IF NOT EXISTS appraisal_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO appraisal_categories (name, description)
VALUES
    ('Productivity', 'Output quality, pace, and consistency'),
    ('Teamwork', 'Collaboration and contribution to team outcomes'),
    ('Communication', 'Clarity, responsiveness, and professional communication'),
    ('Leadership', 'Ownership, influence, and decision-making'),
    ('Problem Solving', 'Analysis, creativity, and solution quality'),
    ('Attendance', 'Reliability, punctuality, and attendance behavior')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS performance_reviews (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (review_period_end >= review_period_start),
    CHECK (status IN ('Open', 'Closed', 'Archived'))
);

CREATE TABLE IF NOT EXISTS appraisals (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    review_id INTEGER REFERENCES performance_reviews(id) ON DELETE SET NULL,
    category_id INTEGER NOT NULL REFERENCES appraisal_categories(id),
    reviewer_name VARCHAR(150) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    appraisal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    department VARCHAR(150),
    recommendation_status VARCHAR(80) NOT NULL CHECK (
        recommendation_status IN (
            'Promotion Recommended',
            'Salary Review Recommended',
            'Needs Improvement',
            'Training Required'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appraisals_employee
ON appraisals(employee_id);

CREATE INDEX IF NOT EXISTS idx_appraisals_category
ON appraisals(category_id);

CREATE INDEX IF NOT EXISTS idx_appraisals_department
ON appraisals(department);

CREATE INDEX IF NOT EXISTS idx_appraisals_rating
ON appraisals(rating);

CREATE INDEX IF NOT EXISTS idx_appraisals_date
ON appraisals(appraisal_date DESC);
