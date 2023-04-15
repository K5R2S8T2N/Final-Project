import React from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import RedirectedMessage from "./RedirectedMessage";
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

class Groups extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
            signedInId: localStorage.getItem("signedinID"),
            redirectReason: localStorage.getItem("redirectMessage"),
        }
    }
    
    notRun = true;
    componentDidMount(){
        if(this.notRun){
            this.checkGroups();

            // check if redirected from another page 
            if(this.state.redirectReason !== null){
                this.setState({redirectMessage: true});
            }
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

    notRedirected = true;
    redirectNotSignedIn = () => {
        if(this.notRedirected){
            this.notRedirected = false;
            localStorage.setItem("redirectMessage", "Sign in to view groups");
            window.location.href = '/';
        }
    }

    openGroup = (e) => {
        e.stopPropagation();
        const groupInfoArr = e.target.id.split('-');
        if(groupInfoArr[3] === 'pending' || groupInfoArr[3] === 'active'){
            console.log('openning');
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
            console.log('deleting');
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

    changeIsOpenMessage = (visibility) => {
        this.setState({redirectMessage: visibility});
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div id='mainGroupsPageDiv'>
                        <h3 id='groupsPageTitle'>Groups</h3>
                        <div id="groupsList">{
                            this.state.groupsList && this.state.groupsList.map( (group, index) => {
                                return  (
                                    <div className='groups' key={`${group[0]}-${group[1]}`}>
                                        <div className='groupsText'>
                                            <h3 className='groupSubtitle'> group name </h3>
                                            <p className='groupSubtext'> {group[0]}</p>
                                            <h3 className='groupSubtitle'> made by </h3>
                                            <p className='groupSubtext'> {group[1]}</p>
                                            <h3 className='groupSubtitle'> status</h3>
                                            <div style={{display: 'flex', alignItems: 'center'}} className='groupSubtext'>
                                                <p style={{marginRight: '6px'}}>{group[2]}</p>
                                                {/* adding icon for status */}
                                                {
                                                  group[2] === 'invalid'? 
                                                    <ErrorOutlineOutlinedIcon style={{display: 'inline', fontSize: '21px'}}/>:
                                                    group[2] === 'pending'?
                                                        <ScheduleOutlinedIcon style={{display: 'inline', fontSize: '21px'}}/>:
                                                        <PeopleAltOutlinedIcon style={{display: 'inline', fontSize: '20px'}}/>
                                                }
                                                
                                            </div>
                                        </div>
                                        <button className='groupOpenBtn' onClick={this.openGroup} id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${this.state.signedIn}`}>
                                            {group[2] === 'invalid' ?
                                                <div className='navBarIcons' id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${this.state.signedIn}`}><DeleteOutlineOutlinedIcon style={{fontSize: '30px'}} className = 'importedLogos'/> Delete </div>:
                                                <div className='navBarIcons' id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${this.state.signedIn}`}><FolderOpenIcon style={{fontSize: '24px'}} className = 'importedLogos'/> Open </div>
                                            }
                                        </button>
                                    </div>
                                )
                            })
                        }</div>
                        <button className="labelWithIcon" id='newGroupBtn' style={{marginBottom: '16px'} }onClick={() => {window.location.href = '/create'}}>< CreateNewFolderIcon style={{marginRight: '2px', marginBottom: '2px', fontSize: '22px'}} className = 'importedLogos'/> New Group</button>
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
               < RedirectedMessage isOpen = {this.state.redirectMessage} changeIsOpen = {this.changeIsOpenMessage} message = {this.state.redirectReason}/>
            </div>
        )
    }
}
export default Groups;