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
creator VARCHAR (20) NOT NULL,
member_id integer,
PRIMARY KEY (group_id),
FOREIGN KEY (member_id) REFERENCES users (user_id)
);

SELECT * FROM groups

CREATE TABLE expenses(
expenses_id SERIAL PRIMARY KEY,
current_group_name VARCHAR (50) NOT NULL,
current_group_creator VARCHAR (50) NOT NULL,
expense VARCHAR (200) NOT NULL,
amount_to_give float4,
amount_to_recieve float4,
amount_overall float4,
currency VARCHAR (50) NOT NULL,
buyer VARCHAR (50) NOT NULL,
receiver VARCHAR (50) NOT NULL,
buyer_involved BOOLEAN NOT NULL
);

SELECT * FROM expenses