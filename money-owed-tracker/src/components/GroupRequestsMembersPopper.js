import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import PendingTwoToneIcon from '@mui/icons-material/PendingTwoTone';

export default function GroupRequestsMembersPopper(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [otherMembers, setOtherMembers] = React.useState(null);

  const getOtherUsers = async (event) => {
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

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={getOtherUsers} id="seeAllMembers">< PendingTwoToneIcon style={{marginRight: '4px', fontSize: '20px'}}/> See All Members</button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          <div>{otherMembers && otherMembers.map((user) => {
            return (
            <div key={user[1]} style={{border: '1px solid black', marginBottom: '5px', padding: '5px'}}>
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