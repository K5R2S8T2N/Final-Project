import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            signedIn: localStorage.getItem("signedin"),
        }

    }


        

    render(){
        return (
            <div className="App" id='footer'>
                <p>Copyright Kirsten Gaddie 2023 ©</p>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap'}}>
                    <p style={{marginRight: '14px'}}><b>Contact:</b></p>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '320px', flexWrap: 'wrap'}}>
                        <a href="mailto: kirstygaddie@icloud.com" className='labelWithIcon footerLinks'>< EmailIcon style={{marginRight: '8px' }}/> Email </a>
                        <a href="https://github.com/K5R2S8T2N" className='labelWithIcon footerLinks'>< GitHubIcon style={{marginRight: '8px' }}/> GitHub</a>
                        <a href="https://www.linkedin.com/in/kirsten-gaddie-b87367271/" className='labelWithIcon footerLinks'>< LinkedInIcon style={{marginRight: '8px' }}/> LinkedIn</a>
                    </div>
                </div>
            </div>

        )
    }
}


export default Footer;