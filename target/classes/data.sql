INSERT INTO users (id, username, password, email) VALUES (1, 'testuser', 'password', 'test@example.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (username, password, email) VALUES ('testuser', 'password', 'test@example.com') ON CONFLICT (username) DO NOTHING; 

-- Income Categories (Note: Income entity currently uses free-text source, but we keep these for future use)
INSERT INTO categories (name, type) VALUES ('Salary', 'INCOME') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Freelance', 'INCOME') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Business', 'INCOME') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Investments', 'INCOME') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Other Income', 'INCOME') ON CONFLICT (name) DO NOTHING;

-- Expense Categories
INSERT INTO categories (name, type) VALUES ('Food', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Rent', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Transport', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Entertainment', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Health', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Education', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name, type) VALUES ('Other Expense', 'EXPENSE') ON CONFLICT (name) DO NOTHING;
