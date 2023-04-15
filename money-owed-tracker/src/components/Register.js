import React from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HowToRegIcon from '@mui/icons-material/HowToReg';

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            passwordHidden: true,
            signedIn: localStorage.getItem("signedin"),
        }
    }
    passwordVisiblilty = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const password = document.getElementById('registerPassword');
        if (this.state.passwordHidden){
            this.setState({passwordHidden:false})
            password.type = 'text';

        } else {
            this.setState({passwordHidden:true})
            password.type = 'password';
        }
    }

    checkFilled = () => {
        const register = document.getElementById('registerSubmit');
        const username = document.getElementById('registerUsername');
        const password = document.getElementById('registerPassword');
        const message = document.getElementById('registerMessage');
        const userCount = username.value.length;
        const passCount = password.value.length;
        const usernameCount = document.getElementById('usernameCount');
        const passwordCount = document.getElementById('passwordCount');
        if (userCount > 0 && passCount > 0 && username.value !== ' ' && password.value !== ' ' && userCount <= 50 && passCount <= 50){
            register.disabled = false;
            usernameCount.innerHTML = '';
            passwordCount.innerHTML = '';
        } else {
            register.disabled = true;
            if (userCount > 50){
                usernameCount.innerHTML = "username too long";
            }
            if (passCount > 50){
                passwordCount.innerHTML = "password too long";
            }
        }
        message.innerHTML = '';

    }

    spacesMessage = (e) => {
        const message = document.getElementById('registerMessage');
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        if(e.keyCode === 32){
            message.innerHTML = `${e.target.name} cannot contain spaces`;
            e.target.value = e.target.value.split(' ').join('');
        }

        if(e.key ==='-'){
            message.innerHTML = `${e.target.name} cannot contain hyphens`;
            e.target.value = e.target.value.split('-').join('');
        }
    }

    register = (e) => {
        e.preventDefault();
        const message = document.getElementById('registerMessage');
        const username = e.target.username.value;
        const password = e.target.password.value;
        const backToHomeBtn = document.getElementById('registerBackToHomeBtn');
        const registerIcon = document.getElementById('successfulRegisterIcon');

        // checking + inserting username into database 
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            message.innerHTML = data.message;
            if(data.submission === "successful"){
                e.target.username.value= "";
                e.target.password.value = "";
                e.target.register.disabled = true;
                backToHomeBtn.style.removeProperty('display');
                registerIcon.style.removeProperty('display');
            }
        })
        .catch((err) => console.log(err))
    }

    // stopping password visiblity button being activated when clicking submit on input 
    prevent = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
        }
        // for resetting username / password too long messages 
        const userCount = document.getElementById('registerUsername').value.length;
        const passCount = document.getElementById('registerPassword').value.length;
        const usernameCount = document.getElementById('usernameCount');
        const passwordCount = document.getElementById('passwordCount');
        if (userCount <= 50 && userCount >= 0){
            usernameCount.innerHTML = '';
        }
        if (passCount <= 50 && passCount >= 0){
            passwordCount.innerHTML = '';
        }
        // for removing back to home message + register icon if registering more than one person 
        const backToHomeBtn = document.getElementById('registerBackToHomeBtn');
        const registerIcon = document.getElementById('successfulRegisterIcon');
        backToHomeBtn.style.display = 'none';
        registerIcon.style.display = 'none';
    }

    logout = () => {
        localStorage.removeItem("signedin");
        localStorage.removeItem("signedinID");
        localStorage.removeItem("groupName");
        localStorage.removeItem("groupCreator");
        localStorage.removeItem("groupStatus");
        localStorage.removeItem("groupMembers");
        localStorage.removeItem("navBarRerender");
        this.setState({signedIn: localStorage.getItem("signedin")});
        window.location.href = '/register';
    }

    render(){
        const checkSignedIn = () => {
            if (this.state.signedIn === null) {
                return (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <PersonAddAlt1Icon id='registerMainIcon'/>
                    <h1 id="registerTitle">Registration</h1>
                    <form onInput={this.checkFilled} onSubmit={this.register} >
                        <div>
                            <div className="labelWithIcon userPassLabels" style={{margin: '10px'}}>
                                < PersonIcon style={{marginRight: '4px', fontSize: '20px'}}/>
                                <label>Username</label>
                            </div>
                            <input type='text' id='registerUsername' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='username'></input>
                            <p id="usernameCount"></p>
                        </div>
                        <div>
                            <div className="labelWithIcon userPassLabels" style={{margin: '10px'}}>
                                < LockIcon style={{marginRight: '4px', fontSize: '16px'}}/>
                                <label>Password</label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <input type='password' id='registerPassword' onKeyUp= {this.spacesMessage} onKeyDown={this.prevent} name='password' style={{marginRight: '8px'}}></input>
                                <button onClick = {this.passwordVisiblilty} className ='visibilitybtn'>
                                    {this.state.passwordHidden?
                                        <div className="labelWithIcon visibleOff">< VisibilityOffIcon style={{marginRight: '4px', fontSize: '16px'}} className = 'importedLogos'/>hidden</div>:
                                        <div className="labelWithIcon visibleOn">< VisibilityIcon style={{marginRight: '4px', fontSize: '16px'}} className = 'importedLogos'/>visible</div>
                                    }
                                </button>
                            </div>
                            <p id='passwordCount'></p>
                        </div>
                        <input name='register' type='submit' id='registerSubmit' value='Register' disabled onSubmit={this.register}/>
                    </form>
                    <div className="labelWithIcon">
                        <HowToRegIcon id="successfulRegisterIcon" style={{marginRight: '8px', display: 'none', color: '8b92a1'}}/>
                        <p id="registerMessage"></p>
                    </div>
                    
                    <button id='registerBackToHomeBtn' onClick={() => {window.location.href = '/groups'}} className='iconBtn' style={{marginBottom: '20px', display: 'none'}}><ArrowBackIosNewIcon sx={{marginRight: '4px', marginLeft: '0px',fontSize: 'medium'}} className = 'importedLogos'/>Back To Home</button>
                </div>
                );
            } else {
                return (
                    <div>
                        <p className='alreadySignedInMessage'>Already signed in. Logout to register</p>
                        <button onClick={this.logout} className='areadySignedInBtn'>logout</button>
                    </div>
                    
                );
            }
        }

        return(
            <div className="loginRegisterPages">
               {checkSignedIn()}
            </div>
            
        )
    }
}
export default Register;