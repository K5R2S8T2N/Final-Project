import React from "react";
import BackToPageBtn from "./BackToPageBtn";
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

class Create extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            members: [`${localStorage.getItem("signedin")}`],
        }
    }
    notRun = true

    componentDidMount(){
        if(this.notRun){
            this.checkDetailsFilledForCreate(this.notRun);
        }
        
    }

    // for redirecting if not signed in 
    notRedirected = true;
    redirectNotSignedIn = () => {
        if(this.notRedirected){
            this.notRedirected = false;
            localStorage.setItem("redirectMessage", "Sign in to view create page");
            window.location.href = '/';
        }
    }

    addingMember = async (e) => {
        const message = document.getElementById('newGroupMembersMessage');
        const createMessage = document.getElementById('createMessage');
        const newUser = e.target.value;
        const count = newUser.length;
        const backToGroupsBtn = document.getElementById('backToGroups');
        backToGroupsBtn.style.display = 'none';

        if (e.key === "Enter"){
            console.log(e.key);
            e.preventDefault();
            if (count <= 51 && count > 0){
                const response = await fetch('http://localhost:3000/checkUSerExists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    member: newUser,
                }),
                })
                const responseJ = await response.json();
                if (responseJ.submission === 'successful'){
                    if (!this.state.members.includes(responseJ.user)){
                        const currentMembers = this.state.members;
                        currentMembers.push(responseJ.user);
                        this.setState({members: currentMembers});
                        console.log(this.state.members);
                        console.log(responseJ.user);
                        message.innerHTML = `0/50`;
                    } else {
                        message.innerHTML = `user "${responseJ.user}" alredy added to group`;
                    }
                    e.target.value = '';
                    
                } else {
                    message.innerHTML = responseJ.message;
                }
                
                
            } else if(count === 0){
                message.innerHTML = 'please enter a valid username';
            } else {
                message.innerHTML = 'username entered is too long';
            }
        }
        this.checkDetailsFilledForCreate();
        createMessage.innerHTML = '';
        createMessage.style = 'background-color: none;';
    }

    spacesMessage = (e) => {
        const message = document.getElementById('newGroupMembersMessage');
        const createMessage = document.getElementById('createMessage');
        const newUser = e.target.value;
        const count = newUser.length;
        message.innerHTML = `${count}/50`;
        createMessage.innerHTML = '';
        createMessage.style = 'background-color: none;';

        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode === 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
        if(e.key === '-'){
            message.innerHTML = `${e.target.name} cannot contain hyphens`;
            e.target.value = e.target.value.split('-').join('');
        }
        this.checkDetailsFilledForCreate();
    }

    otherSpacesMessage = (e) => {
        const message = document.getElementById('newGroupNameMessage');
        const createMessage = document.getElementById('createMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode === 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
        if(e.key === '-'){
            message.innerHTML = `${e.target.name} cannot contain hyphens`;
            e.target.value = e.target.value.split('-').join('');
        }
        this.checkDetailsFilledForCreate();
        createMessage.innerHTML = '';
        createMessage.style = 'background-color: none;';
    }

    changeGroupName = (e) => {
        const groupName = document.getElementById('newGroupName');
        const message = document.getElementById('newGroupNameMessage');
        const createMessage = document.getElementById('createMessage');
        const backToGroupsBtn = document.getElementById('backToGroups');
        message.innerHTML = '';
        backToGroupsBtn.style.display = 'none';
        if(e.key === 'Enter'){
            e.preventDefault();
            if(e.target.value.length > 50){
                message.innerHTML = 'group name too long';
            } else {
                // check if group namem already taken 
                fetch('http://localhost:3000/checkGroupName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        group: e.target.value,
                        user: localStorage.getItem("signedin"),
                    }),
                })
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    if(data.submission === "successful"){
                        groupName.innerHTML = data.name;
                        groupName.style = 'background: rgb(249, 249, 249); margin-bottom: 10px; padding: 10px 20px 10px 20px;';
                        e.target.value = "";
                    } else {
                        message.innerHTML = data.message;
                    }
                    this.checkDetailsFilledForCreate();
                })
                .catch((err) => console.log(err))
                message.innerHTML = '';
                createMessage.innerHTML = '';
                createMessage.style = 'background-color: none;';
            } 
            this.checkDetailsFilledForCreate();
        }
        
    }

    deleteUser = (e) => {
        const message = document.getElementById('newGroupMembersMessage');
        const createMessage = document.getElementById('createMessage');
        message.innerHTML = '';
        createMessage.innerHTML = '';
        createMessage.style = 'background-color: none;';
        if ( e.target.id === localStorage.getItem("signedin")){
            message.innerHTML = 'you cannot delete yourself from the group';
            
        } else {
            let newMembersArray = this.state.members;
            newMembersArray = newMembersArray.filter(member => member !== e.target.id);

            this.setState({members: newMembersArray}, () => {
                this.checkDetailsFilledForCreate();
            });
        }
        
        
    }

    checkDetailsFilledForCreate = () => {
        this.notRun = false;
        const newGroupName = document.getElementById('newGroupName');
        const createGroupBtn = document.getElementById('createGroup');
        const membersArray = this.state.members;
        if (membersArray.length > 1 && newGroupName.innerHTML.length !== 0 && newGroupName.innerHTML !== ' '){
            createGroupBtn.disabled = false;
        } else {
            createGroupBtn.disabled = true;
        }
    }

    createGroup = (e) => {
        e.target.disabled = true
        const newMembers = this.state.members;
        const groupName = document.getElementById('newGroupName');
        const message = document.getElementById('createMessage');
        const addingMemberInput = document.getElementById('addingMemberInput');
        const groupNameInput = document.getElementById('groupName');
        const newGroupMembersMessage = document.getElementById('newGroupMembersMessage');
        const newGroupNameMessage = document.getElementById('newGroupNameMessage');
        const backToGroupsBtn = document.getElementById('backToGroups');
         // add new group to database 
         fetch('http://localhost:3000/addNewGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                members: newMembers,
                name: groupName.innerHTML,
                user: localStorage.getItem("signedin"),
            }),
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            message.innerHTML = data.message;
            message.style = 'background-color: #cad2e3;';
            this.setState({members: [`${localStorage.getItem("signedin")}`]});
            groupName.innerHTML = ' ';
            groupName.style = 'background: none; margin: 0px; padding: 0px';
            addingMemberInput.value ='';
            groupNameInput.value = '';
            newGroupMembersMessage.innerHTML = '';
            newGroupNameMessage.innerHTML = '';
            backToGroupsBtn.style.removeProperty('display');
        })
        .catch((err) => console.log(err))
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div className="centerColumnContent">
                        <h1 className='creatingPagesTitle'>Create New Group</h1>

                        <div className="centerColumnContent">
                            <h3 className='groupInputTitle' id='groupMembersTitle'>Group Members</h3>
                            <div id="newGroupMembersList" >{
                                this.state.members && this.state.members.map( (user) => {
                                    return  (
                                        <div key={user} className='newGroupMembers'>
                                            <p>{user}</p>
                                            <button id={user} onClick={this.deleteUser} className='iconBtn CreateDeleteUser'>< PersonRemoveIcon style={{marginRight: '8px'}} className = 'importedLogos'/> delete</button>
                                        </div>
                                    )
                                })
                            }</div>
                            <form>
                                <div>
                                    <label className='labelWithIcon createInputLabels'>< PersonAddAlt1Icon style={{marginRight: '8px'}} className = 'importedLogos'/> add member</label>
                                    <input type='text' id='addingMemberInput' name='member' onKeyDown={this.addingMember} onKeyUp={this.spacesMessage}></input>
                                    <p id='newGroupMembersMessage'></p>
                                </div>
                            </form>
                        </div>

                        <div className="centerColumnContent">
                            <h3 className='groupInputTitle' id='groupNameTitle'>Group Name</h3>
                            <h4 id='newGroupName'> </h4>
                            <form>
                            <label className='labelWithIcon createInputLabels'><DriveFileRenameOutlineRoundedIcon style={{marginRight: '8px'}} className = 'importedLogos'/> change group name</label>
                                <input type='text' id='groupName' name='group name' onKeyUp={this.otherSpacesMessage} onKeyDown={this.changeGroupName}></input>
                                <p id='newGroupNameMessage'></p>
                            </form>
                        </div>

                        <div className="centerColumnContent">
                            <button name='create' id='createGroup' onClick={this.createGroup}><SaveIcon className = 'importedLogos'/> Create Group</button>
                            <p id="createMessage"></p>
                            <button name='backToGroups' id='backToGroups' onClick={() => {window.location.href = '/groups'}} className='navBarIcons' style={{marginBottom: '20px', display: 'none'}}>< ExitToAppIcon style={{fontSize: '24px'}} className = 'importedLogos'/>Back to Groups</button>
                        </div>
                        
                        <div id='backBtnsDivCreate'>
                            <BackToPageBtn location={'/groups'} message={'Back To Groups'} pageRedirectedTo={'Groups Page'}/>
                            <BackToPageBtn location={'/'} message={'Back To Home Page'} pageRedirectedTo={'Home Page'}/>
                        </div>
                       
                    </div>
                    
                );
            } else {
                return (
                    <div>
                        {this.redirectNotSignedIn()}
                    </div>
                    
                );
            }
        }

        return(
            <div style={{minHeight: '800px'}}>
               {checkSignedIn()}
            </div>
        )
    }
}
export default Create;