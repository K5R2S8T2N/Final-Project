import React from "react";

class OpenPendingGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            groupName: localStorage.getItem("groupName"),
        }
    }
    notRun = true;
    componentDidMount(){
        if(this.notRun){
            this.openGroup();
        }
        
    }

    openGroup = async () => {
        this.notRun = false;
        const response = await fetch('http://localhost:3000/loadSpecificGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
                groupName: localStorage.getItem("groupName"), 
                groupCreator: localStorage.getItem("groupCreator"),
                groupStatus: localStorage.getItem("groupStatus"),
            }),
        });
        const responseJ = await response.json();

        if (responseJ.status === 'pending'){
            this.setState({pendingUsers: responseJ.pendingUsersArr});
        } else{
            this.setState({pendingUsers: null});
            window.location.href = '/opengroup';
        }
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null && this.state.groupName != null) {
                return (
                    <div>
                        <h3>Group: {this.state.groupName}</h3>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <p>This group is still pending. Waiting on the following users to respond to group request:</p>
                            <ul style={{listStyleType: 'circle'}}>{ this.state.pendingUsers && this.state.pendingUsers.map(user => {
                                return (
                                    <li style={{textAlign: 'left'}} key={user}>{user}</li>
                                )
                            })
                            }</ul>
                        </div>
                    </div>
                );
            } else if (this.state.signedIn != null && this.state.groupName == null){
                return (
                    <div>
                        <p>No Group Selected</p>
                    </div>
                );
            } else {
                return (
                    <div>
                        <p>Sign in to view groups</p>
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
export default OpenPendingGroup;