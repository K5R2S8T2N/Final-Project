import React from "react";

class Create extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            members: [`${localStorage.getItem("signedin")}`],
        }
    }
    componentDidMount(){
        const signedIn = localStorage.getItem("signedin");
    }

    addingMember = async (e) => {
        const message = document.getElementById('newGroupMembersMessage');
        const newUser = e.target.value;
        const count = newUser.length;
        if (e.key == "Enter"){
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
    }

    spacesMessage = (e) => {
        const message = document.getElementById('newGroupMembersMessage');
        const newUser = e.target.value;
        const count = newUser.length;
        message.innerHTML = `${count}/50`;

        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode == 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
    }

    otherSpacesMessage = (e) => {
        const message = document.getElementById('newGroupNameMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode == 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }
    }

    changeGroupName = (e) => {
        const groupName = document.getElementById('newGroupName');
        const message = document.getElementById('newGroupNameMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
            groupName.innerHTML = e.target.value;
            e.target.value = "";
        }
        message.innerHTML = '';
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div>
                        <div>
                            <h3>Group Members</h3>
                            <div id="newGroupMembersList">{
                                this.state.members && this.state.members.map( (user) => {
                                    return  (
                                        <div key={user} class='newGroupMembers'>
                                            <p>{user}</p>
                                            <button>delete</button>
                                        </div>
                                    )
                                })
                            }</div>
                            <form>
                                <div>
                                    <label>add member</label>
                                    <input type='text' id='memberUsername' name='member' onKeyDown={this.addingMember} onKeyUp={this.spacesMessage}></input>
                                    <p id='newGroupMembersMessage'></p>
                                </div>
                            </form>
                        </div>
                        <div>
                            <h3>Group Name</h3>
                            <h4 id='newGroupName'></h4>
                            <form>
                            <label>change group name</label>
                                <input type='text' id='groupName' name='group name' onKeyUp={this.otherSpacesMessage} onKeyDown={this.changeGroupName}></input>
                                <p id='newGroupNameMessage'></p>
                            </form>
                        </div>
                        <input name='create' type='submit' id='createGroup' value='Create Group'disabled/>
                        <p id="createMessage"></p>
                    </div>
                    
                );
            } else {
                return (
                    <div>
                        <p>Sign in to view create page</p>
                    </div>
                    
                );
            }
        }

        return(
            <div>
               {checkSignedIn()}
            </div>
        )
    }
}
export default Create;