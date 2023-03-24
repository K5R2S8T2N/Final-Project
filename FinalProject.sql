CREATE TABLE users(
 user_id SERIAL PRIMARY KEY,
 username VARCHAR (50) NOT NULL,
 password VARCHAR (50)
)

SELECT * FROM users

CREATE TABLE groups(
group_id SERIAL,
group_name VARCHAR (50) NOT NULL,
status VARCHAR (20) NOT NULL,
signed_in_id VARCHAR (50),
PRIMARY KEY (groups_id),
FOREIGN KEY (signed_in_id) REFERENCES users (user_id)
);