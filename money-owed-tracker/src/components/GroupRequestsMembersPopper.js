import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import PendingTwoToneIcon from '@mui/icons-material/PendingTwoTone';

export default function GroupRequestsMembersPopper(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [otherMembers, setOtherMembers] = React.useState(null);

  const getOtherUsers = async (event) => {
    if(!open){
      event.currentTarget.style = 'border: 2px solid rgb(80, 110, 148); font-size: 18px; font-weight: 800; background-color: rgb(81, 143, 164); color: rgb(193, 205, 220);';
    } else {
      event.currentTarget.style = 'font-size: 16px; margin-bottom: 10px; font-family: Andale Mono, monospace; font-weight: 600; border: 3px solid rgb(157, 152, 152); border-radius: 15px; padding: 10px 15px 10px 15px; background-color: rgb(162, 173, 183); color: rgb(120, 135, 145);';
    }

    setAnchorEl(anchorEl ? null : event.currentTarget);
    const otherUsersBtnArr = props.information.split('-');
    const position = otherUsersBtnArr[1];
    const requestInfo = props.requestsInfo[position];
    const response = await fetch('http://localhost:3000/loadOtherRequestMembers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: requestInfo[0],
        creator: requestInfo[1],
        idsArr: requestInfo[2],

      }),
    });
    const responseJ = await response.json();
    const allMembersArr = responseJ.results;
    setOtherMembers(allMembersArr);
  };

  const mouseOverBtn = (event) => {
    event.currentTarget.style = 'border: 2px solid rgb(80, 110, 148); font-size: 18px; font-weight: 800; background-color: rgb(81, 143, 164); color: rgb(193, 205, 220);';
  }

  const mouseOutBtn = (event) => {
    if(open){
      event.currentTarget.style = 'border: 2px solid rgb(80, 110, 148); font-size: 18px; font-weight: 800; background-color: rgb(81, 143, 164); color: rgb(193, 205, 220);';
    } else {
      event.currentTarget.style = 'font-size: 16px; margin-bottom: 10px; font-family: Andale Mono, monospace; font-weight: 600; border: 3px solid rgb(157, 152, 152); border-radius: 15px; padding: 10px 15px 10px 15px; background-color: rgb(162, 173, 183); color: rgb(120, 135, 145);';
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={getOtherUsers} onMouseOver={mouseOverBtn} onMouseOut ={mouseOutBtn} id="seeAllMembers">< PendingTwoToneIcon style={{marginRight: '4px', fontSize: '20px'}} className = 'importedLogos'/> See All Members</button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box id='otherMembersMainDiv'>
          <div>{otherMembers && otherMembers.map((user) => {
            return (
            <div key={user[1]} className ='otherUsersDiv'>
              <p>username: {user[2]}</p>
              <p>status: {user[0]}</p>
            </div>
            )})
          }</div>
        </Box>
      </Popper>
    </div>
  );
}