-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
    admin_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

-- DONORS
CREATE TABLE IF NOT EXISTS donors (
    donor_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

-- DONATIONS
CREATE TABLE IF NOT EXISTS donations (
    donation_id SERIAL PRIMARY KEY,
    donor_id VARCHAR(50),
    admin_id VARCHAR(50),
    amount DECIMAL(10, 2),
    date DATE,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

-- CHILDREN
CREATE TABLE IF NOT EXISTS children (
    child_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50),
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    bio TEXT,
    is_sponsored BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

CREATE TABLE IF NOT EXISTS sponsorships (
    sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id VARCHAR(50),
    child_id INT,  -- fixed to match children.child_id type
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (child_id) REFERENCES children(child_id)
);


-- NEEDS
CREATE TABLE IF NOT EXISTS needs (
    need_id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50),
    category VARCHAR(100),
    title VARCHAR(150),
    description TEXT,
    amount_needed DECIMAL(10, 2),
    amount_received DECIMAL(10, 2) DEFAULT 0,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
    report_id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50),
    report_name VARCHAR(150),
    donor_name VARCHAR(100),
    amount DECIMAL(10, 2),
    usage_details TEXT,
    used_on DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

-- SUCCESS STORIES
CREATE TABLE IF NOT EXISTS success_stories (
    story_id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50),
    title VARCHAR(150),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);
