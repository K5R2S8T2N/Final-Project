const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());

const db = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    }
});
app.set("db", db);
app.use(cors());

// app.use('/test', async (req, res) => {
//     const data = await db('users').select();
//     res.json(data);
// })

// for registering 
app.post('/register', (req, res) => {
    const {username, password} = req.body;
    let count = 0;
    db('users')
    .where('username', username)
    .then((data) => {
        data.forEach((element) => {
            count++;
        });
        if (count != 0){
            console.log("username already taken");
            res.send({message: `username "${username}" already taken`, submission: "unsuccessful"});
        } else {
            db('users')
            .insert({
                username: username,
                password: password,
            })
            .then((data) => {
                console.log(data);
            });
            res.send({message: `User "${username}" created`, submission: "successful"});
        }
    });     
});

// for logging in 
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    let count = 0;
    db('users')
    .where({ username:`${username}`, password: `${password}`})
    .then((data) => {
        data.forEach((element) => {
            count++;
        });
        if (count != 0){
            console.log("login successful");
            res.send({message: `username "${username}" logged in successfully`, submission: "successful", user: username});
        } else {
            res.send({message: "username or password is incorrect", submission: "unsuccessful"});
        }
    });     
});


// for creating new group 
app.post('/checkUSerExists', (req, res) => {
    const {member} = req.body;
    let count = 0;
    db('users')
    .where({ username:`${member}`})
    .then((data) => {
        data.forEach((element) => {
            count++;
        });
        if (count != 0){
            res.send({submission: "successful", user: member});
        } else {
            res.send({message: `unable to find user with username: ${member}`, submission: "unsuccessful"});
        }
    });
});

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));