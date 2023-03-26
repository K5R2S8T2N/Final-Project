const express = require('express');
const app = express();
const cors = require('cors');
const { request } = require('express');
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
            res.send({message: `username "${username}" logged in successfully`, submission: "successful", user: username, id: data[0].user_id});
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

// for checking if group name is taken in create 
app.post('/checkGroupName', async (req, res) => {
    const {group, user} = req.body;
    let count = 0;
    db('groups')
    .where({ group_name:`${group}`, creator: `${user}`})
    .then((data) => {
        data.forEach((element) => {
            count++;
        });
        if (count != 0){
            res.send({submission: "unsuccessful", message: `group with name "${group}" already exists. Please choose another name.`});
        } else {
            res.send({submission: "successful", name:group});
        }
    });
});

// add new group to database 
app.post('/addNewGroup', async (req, res) => {
    const {members, name, user} = req.body;
    members.forEach((member) => {
        let stat = 'requested';
        if (member === user){
            stat = 'creator';
        } 
        db('users')
        .where({ username:`${member}`})
        .then((data) => { 
            const id = data[0].user_id;
            db('groups')
            .insert({
                group_name: name,
                status: stat,
                creator: user,
                member_id: id,
            })
            .then((data) => {
                console.log(data);
            });
        })
    })
    res.send({message: `group "${name}" added successfully with ${members.length} members: ${members.map(member => {return member})}`});
});

// load request name and creator for user 
app.post('/loadRequests', async (req, res) => {
    const {userId} = req.body;
    const requestArray = [];
        db('groups')
            .where({member_id: userId, status: 'requested'})
            .then((data) => {
                data.forEach((request) => {
                    const newRequest = [request.group_name, request.creator];
                    requestArray.push(newRequest);
                });
                res.send({info: requestArray});
            });
});


// load other members ids in request for user 
app.post('/loadOtherMembersIds', async (req, res) => {
    const {name, creator} = req.body;
    db('groups')
        .where({group_name: name, creator: creator})
        .then((otherMembers) => {
            const otherMembersArr = [];
            otherMembers.forEach((member) => {
                otherMembersArr.push(member.member_id)
            })
            res.send({otherMembersId: otherMembersArr});
        });
});

// load info about other members of group request 
app.post('/loadOtherRequestMembers', async (req, res) => {
    const {name, creator, idsArr} = req.body;
    const array = [];
    let membersProcessed = 0;
    idsArr.forEach(async (id, index, arr) => {

        // get user id and status in group
        const info = await db('groups')
            .where({group_name: name, creator: creator, member_id: id})
            .then((member) => {
                const status = member[0].status;
                const membId = member[0].member_id
                return [status, membId];   
            });

        // get user's username 
        const username = await db('users')
            .where({user_id: info[1]})
            .then((user) => {
                const usern = user[0].username;
                return usern;
            })

        // save id, username and status in an array
        info.push(username);
        array.push(info);
        membersProcessed++;

        // send back array of all users once all users info collected
        if (membersProcessed === arr.length){
            res.send({results: array});
        }
    });
    
});

// respond to new group request
app.post('/requestResponse', (req, res) => {
    const {response, name, creator, userResponding} = req.body;
    db('groups')
        .where('group_name', name)
        .andWhere('creator', creator)
        .andWhere('member_id', userResponding)
        .update({
            status: response,
        }, ['group_name', 'status'])
        .then(requestResponse =>
            res.send(requestResponse)
        );
});

// for loading groups 
app.post('/loadGroups', async (req, res) => {
    const {userId} = req.body;
    const groupsArray = [];
    db('groups')
        .where('member_id', userId)
        .andWhere('status', 'creator')
        .orWhere('status', 'accepted')
        .then((data) => { 
            data.forEach((group) => {
                const newGroup = [group.group_name, group.creator];
                groupsArray.push(newGroup);
            });
            res.send({groups: groupsArray});
        })
});

// for loading user status for group status
app.post('/getGroupStatus', async (req, res) => {
    const {name, creator} = req.body;
    db('groups')
        .where('group_name', name)
        .andWhere('creator', creator)
        .then((group) => { 
            const allUsersStatusArr = [];
            group.forEach((member) => {
                // const userInfo = [member.member_id, member.status]
                allUsersStatusArr.push(member.status);
            })
            res.send({usersStatusInfo: allUsersStatusArr});
        })
});

// app.use('/test', async (req, res) => {
//     const data = await db('users').select();
//     res.json(data);
// })

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));