import React from "react";
import GroupRequestsMembersPopper from "./GroupRequestsMembersPopper";
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

class Requests extends React.Component{
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
            this.checkRequests();
        }
        
    }

    // for redirecting if not signed in 
    notRedirected = true;
    redirectNotSignedIn = () => {
        if(this.notRedirected){
            this.notRedirected = false;
            localStorage.setItem("redirectMessage", "Sign in to view requests");
            window.location.href = '/';
        }
    }

    checkRequests = async () => {
        this.notRun = false;
        const response = await fetch('http://localhost:3000/loadRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.signedInId,
            }),
        });
        const responseJ = await response.json();
        const responseJArr = responseJ.info;
        responseJArr.forEach((request) => {
            const name = request[0];
            const creator = request[1];
            // get ids of other members of request group
            fetch('http://localhost:3000/loadOtherMembersIds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    creator: creator,
                }),
            }).then((res) => {
                return res.json()
            })
            .then((data) => {
                request.push(data.otherMembersId);
            });
        })
        this.setState({groupRequests: responseJArr});
    }

    respondRequest = async (e) => {
        const requestMessage = document.getElementById('requestMessage');
        const requestTypeArr = e.target.id.split('-');
        const response = await fetch('http://localhost:3000/requestResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response: requestTypeArr[0],
                name: requestTypeArr[1],
                creator: requestTypeArr[2],
                userResponding: localStorage.getItem("signedinID"),

            }),
        });
        const responseJ = await response.json();
        requestMessage.innerHTML = `group "${responseJ[0].group_name}" ${responseJ[0].status}`;
        localStorage.setItem("navBarRerender", true);
        this.checkRequests();
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn != null) {
                return (
                    <div id='mainRequestsPageDiv'>
                        <h3 id='requestPageTitle'>Requests Page</h3>
                        <p id="requestMessage"></p>
                        <div id="requestsList">{
                            this.state.groupRequests && this.state.groupRequests.map( (request, index) => {
                                return  (
                                    <div className='requests' key={`${request[0]}-${request[1]}`}>
                                        <div className='requestsText'>
                                            <h3 className='requestSubtitle'> group name</h3>
                                            <p className='requestSubtext'>{request[0]}</p>
                                            <h3 className='requestSubtitle'> made by </h3>
                                            <p className='requestSubtext'>{request[1]}</p>
                                            <GroupRequestsMembersPopper information={`otherusers-${index}`} requestsInfo={this.state.groupRequests}/>
                                        </div>
                                        
                                        <div id='requestsButtonsDiv' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 
                                            <button id={`accepted-${request[0]}-${request[1]}`} onClick={this.respondRequest} className="navBarIcons requestsRespondBtn" style={{marginBottom: '10px'}}><ThumbUpAltTwoToneIcon style={{fontSize: '18px'}} className = 'importedLogos'/>accept</button>
                                            <button id={`declined-${request[0]}-${request[1]}`} onClick={this.respondRequest} className="navBarIcons requestsRespondBtn" style={{marginTop: '10px'}}><ThumbDownAltTwoToneIcon style={{fontSize: '18px'}} className = 'importedLogos'/>decline</button>  
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
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
export default Requests;