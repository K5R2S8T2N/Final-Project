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
        ssl: { rejectUnauthorized: false }
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
        .where({member_id: userId, status: 'accepted'})
        .orWhere({member_id: userId, status: 'creator'})
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
                allUsersStatusArr.push(member.status);
            })
            res.send({usersStatusInfo: allUsersStatusArr});
        })
});

// for deleting invalid groups 
app.post('/deleteInvalidGroup', (req, res) => {
    const {groupName, groupCreator} = req.body; 
    db('groups')
        .where({group_name: groupName, creator: groupCreator})
        .del(['group_id', 'group_name', 'status', 'creator', 'member_id'])
        .then(members =>
            res.send({membersToRemove: members})
        )
});

// for opening group page 
app.post('/openGroup', (req, res) => {
    const {groupName, groupCreator, status} = req.body;
    if (status === 'pending'){
        res.send({submission: 'pending'});
    } else {
        res.send({submission: 'active'});
    }
    
});

app.post('/loadSpecificGroup', (req, res) => {
    const {userId, groupName, groupCreator, groupStatus} = req.body;
    if (groupStatus === 'pending'){
        db('groups')
            .where({group_name: `${groupName}`, creator: `${groupCreator}`, status: 'requested'})
            .then((members) => {
                let count = 0;
                const pendingUsersArr = [];
                members.forEach ((member, index, arr) => {
                    db('users')
                        .where({user_id: `${member.member_id}`})
                        .then((user) => {
                            pendingUsersArr.push(user[0].username)
                            count++;

                            if(count == arr.length){
                                res.send({pendingUsersArr: pendingUsersArr, status: "pending", name: `${groupName}`});
                            }
                        })
                })
            })
    } else if (groupStatus === 'active'){
        console.log('page is active');
        // get group members
        db('groups')
        .where({group_name: `${groupName}`, creator: `${groupCreator}`, status: 'accepted'})
        .orWhere({group_name: `${groupName}`, creator: `${groupCreator}`, status: 'creator'})
        .then((members) => {
            let count = 0;
            const UsersArr = [];
            members.forEach ((member, index, arr) => {
                db('users')
                    .where({user_id: `${member.member_id}`})
                    .then((user) => {
                        UsersArr.push(user[0].username)
                        count++;

                        if(count == arr.length){
                            res.send({UsersArr: UsersArr, status: "active", name: `${groupName}`, creator: `${groupCreator}`});
                        }
                    });
            });
        });
    } else {
        res.send({status: 'no group selected'})
    }
});

// for making sure group does not contain expense name yet 
app.post('/checkExpenseName', (req, res) => {
    const {groupName, expenseName, groupCreator} = req.body;
    db('expenses')
        .where({current_group_name: `${groupName}`, expense: `${expenseName}`, current_group_creator: `${groupCreator}`})
        .then((groupDetails) => {
            if(groupDetails.length !== 0){
                console.log('expense name already taken');
                res.send({status: 'unavailable', message: `Expense "${expenseName}" already exists`});
            } else {
                res.send({status: 'available'});
            }
        })
});

app.post('/addToExpenseTable', (req, res) => {
    const {groupName, creator, expense, amount, currency, buyer, involvedArr} = req.body;
    let count = 0;
    let buyerInvolved = true; 
    let needToInsertBuyer = false;
    if (!involvedArr.includes(buyer)){
        buyerInvolved = false;
        needToInsertBuyer = true;
    }

    involvedArr.forEach((user, index, arr) => {
        if( user === buyer){
            db('expenses')
            .insert({
                current_group_name: groupName,
                current_group_creator: creator,
                expense: expense,
                amount_to_give: 0,
                amount_to_recieve: amount - (amount/arr.length),
                amount_overall: amount,
                currency: currency,
                buyer: buyer,
                receiver: user,
                buyer_involved: buyerInvolved,
            })
            .then((data) => {
                if(needToInsertBuyer){
                    needToInsertBuyer = false;
                    db('expenses')
                        .insert({
                            current_group_name: groupName,
                            current_group_creator: creator,
                            expense: expense,
                            amount_to_give: 0,
                            amount_to_recieve: amount,
                            amount_overall: amount,
                            currency: currency,
                            buyer: buyer,
                            receiver: buyer,
                            buyer_involved: buyerInvolved,
                        })
                        .then(() => { 
                            count++;
                            if(count == arr.length){
                                res.send({result: 'done'});
                            }
                        })      
                } else {
                    count++;
                    if(count == arr.length){
                        res.send({result: 'done'});
                    }
                }
            });
        } else {
            db('expenses')
            .insert({
                current_group_name: groupName,
                current_group_creator: creator,
                expense: expense,
                amount_to_give: amount/arr.length,
                amount_to_recieve: 0,
                amount_overall: amount,
                currency: currency,
                buyer: buyer,
                receiver: user,
                buyer_involved: buyerInvolved,
            })
            .then((data) => {
                if(needToInsertBuyer){
                    needToInsertBuyer = false;
                    db('expenses')
                        .insert({
                            current_group_name: groupName,
                            current_group_creator: creator,
                            expense: expense,
                            amount_to_give: 0,
                            amount_to_recieve: amount,
                            amount_overall: amount,
                            currency: currency,
                            buyer: buyer,
                            receiver: buyer,
                            buyer_involved: buyerInvolved,
                        })
                        .then(() => { 
                            count++;
                            if(count == arr.length){
                                res.send({result: 'done'});
                            }
                        })   
                } else {
                    count++;
                    if(count == arr.length){
                        res.send({result: 'done'});
                    }
                }
            });
        }
    })
});

// for loading group expense on specific group page 
app.post('/loadSpecificExpensesForGroup', (req, res) => {
    const {signedIn, groupName, groupCreator} = req.body;
    db('expenses')
        .where({current_group_name: `${groupName}`, current_group_creator: `${groupCreator}`})
        .then((data) => {
            const Expensesobj = {};
            data.forEach((entry) => {
                if (!(entry.expense in Expensesobj)) {
                    Expensesobj[entry.expense] = {
                        amount: entry.amount_overall,
                        currency: entry.currency,
                        buyer: entry.buyer,
                        buyerInvolved: entry.buyer_involved,
                        involved: [entry.receiver]
                    }
                } else {
                    Expensesobj[entry.expense].involved.push(entry.receiver);
                }
            })
            res.send({overview: data, Expensesobj: Expensesobj});
        })
});

// for deleting expense on open group page 
app.post('/deleteExpense', (req, res) => {
    const {groupName, expenseName} = req.body;
    db('expenses')
        .where({current_group_name: groupName, expense: expenseName})
        .del(['current_group_name', 'current_group_creator', 'expense', 'amount_to_give', 'amount_to_recieve', 'amount_overall', 'currency', 'buyer', 'receiver', 'buyer_involved'])
        .then(expensePerMember =>
            res.send({deletedExpenseArr: expensePerMember})
        )
})
// app.use('/test', async (req, res) => {
//     const data = await db('users').select();
//     res.json(data);
// })

app.get('/', (req, res) => { res.send('testing server side')})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));