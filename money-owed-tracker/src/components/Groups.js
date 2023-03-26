import React from "react";

class Groups extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
        }
    }
    componentDidMount(){
        this.checkGroups();
    }
    checkGroups = async () => {
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
            console.log(getGroupStatusJ.usersStatusInfo);
            let stat = 'active';
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
    })
        
        
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
                                        <button id='groupsSeeMoreBtn'>see more</button>
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