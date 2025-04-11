-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);

-- View users
SELECT * FROM users;

-- Create groups table
CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  creator VARCHAR(50) NOT NULL,
  member_id INTEGER,
  FOREIGN KEY (member_id) REFERENCES users(user_id)
);

-- View groups
SELECT * FROM groups;

-- Create expenses table
CREATE TABLE expenses (
  expenses_id SERIAL PRIMARY KEY,
  current_group_name VARCHAR(50) NOT NULL,
  current_group_creator VARCHAR(50) NOT NULL,
  expense VARCHAR(200) NOT NULL,
  amount_to_give FLOAT4,
  amount_to_recieve FLOAT4,
  amount_overall FLOAT4,
  currency VARCHAR(50) NOT NULL,
  buyer VARCHAR(50) NOT NULL,
  receiver VARCHAR(50) NOT NULL,
  buyer_involved BOOLEAN NOT NULL
);

-- View expenses
SELECT * FROM expenses;
