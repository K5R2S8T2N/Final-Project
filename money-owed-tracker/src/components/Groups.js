import React from "react";

class Groups extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
        }
    }
    notRun = true;

    componentDidMount(){
        if(this.notRun){
            this.checkGroups();
        }
        
    }
    checkGroups = async () => {
        this.notRun = false;
        const response = await fetch('http://localhost:3000/loadGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
            }),
        });
        const responseJ = await response.json();
        const groupsInfo = responseJ.groups;
        let groupsProcessed = 0;
        groupsInfo.forEach( async (group, index, arr) => {
            const getGroupStatus = await fetch('http://localhost:3000/getGroupStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: group[0],
                    creator: group[1],
                }),
            });
            const getGroupStatusJ = await getGroupStatus.json();
            let stat = 'invalid';

            getGroupStatusJ.usersStatusInfo.forEach( (status) => {
                if (status === 'accepted'){
                    stat = 'active';
                }
            });
            getGroupStatusJ.usersStatusInfo.forEach( (status) => {
                if (status === 'requested'){
                    stat = 'pending';
                }
            });
            group.push(stat);
            groupsProcessed++;
            if(groupsProcessed === arr.length){
                this.setState({groupsList: groupsInfo});
            }
        });
    }
    openGroup = (e) => {
        const groupInfoArr = e.target.id.split('-');
        if(groupInfoArr[3] === 'pending' || groupInfoArr[3] === 'active'){
            localStorage.setItem("groupName", groupInfoArr[1]);
            localStorage.setItem("groupCreator", groupInfoArr[2]);
            localStorage.setItem("groupStatus", groupInfoArr[3]);
            fetch('http://localhost:3000/openGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName: groupInfoArr[1],
                    groupCreator: groupInfoArr[2],
                    status: groupInfoArr[3],
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(data.submission === "pending"){
                    window.location.href = '/openpending';
                } else{
                    window.location.href = '/opengroup';
                }
            })
            .catch((err) => console.log(err))
        } else {
            fetch('http://localhost:3000/deleteInvalidGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName: groupInfoArr[1],
                    groupCreator: groupInfoArr[2],
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                const newGroupsList = this.state.groupsList;
                newGroupsList.forEach((group, index) => {
                    if(group[0] === data.membersToRemove[0].group_name && group[1] === data.membersToRemove[0].creator){
                        newGroupsList.splice(index, 1);
                    }
                });
                this.setState({groupsList: newGroupsList});

            })
            .catch((err) => console.log(err))
            
        }
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div>
                        <h3>Groups</h3>
                        <div id="groupsList">{
                            this.state.groupsList && this.state.groupsList.map( (group, index) => {
                                return  (
                                    <div className='groups' key={`${group[0]}-${group[1]}`}>
                                        <div>
                                            <p> group name: {group[0]}</p>
                                            <p> made by: {group[1]}</p>
                                            <p> status: {group[2]}</p>
                                        </div>
                                        <button id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${this.state.signedIn}`} className='groupOpenBtn' onClick={this.openGroup}>{group[2] === 'invalid' ? 'delete' : 'open'}</button>
                                    </div>
                                )
                            })
                        }</div>
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
export default Groups;