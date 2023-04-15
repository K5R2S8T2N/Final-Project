import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

export default function ActiveGroups(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    if (localStorage.getItem("navBarRerender")){
      localStorage.setItem("navBarRerender", true);
      props.resetting();
    }

    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className='navBarIcons'
          sx = {{marginBottom: '0px', fontFamily: 'sans-serif', textTransform: 'initial', lineHeight: 'initial', fontSize: 'initial', color: 'purple', paddingBottom: '0px'}}
        >
          <MoreHorizIcon sx={{fontSize: '36px'}}/> Active Groups
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          style={{zIndex: 999}}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    style={{height: '600px', overflow: 'scroll'}}
                  >{
                    props.groupsList.map( (group) => {
                        if( group[2] === 'active'){
                            return  (
                                <MenuItem className='groups' key={`${group[0]}-${group[1]}`} style={{width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <div className='activeGroupsTextDiv'>
                                            <h4 style={{overflow: 'word-break'}}> group name</h4>
                                            <p>{group[0]}</p>
                                            <h4> made by</h4>
                                            <p>{group[1]}</p>
                                        </div>
                                        <div className='activeGroupsBtnDiv'>
                                            <button className='activeGroupOpenBtn' onClick={props.openGroup} id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${props.signedIn}`}>
                                                <div className='navBarIcons' id={`openBtn-${group[0]}-${group[1]}-${group[2]}-${props.signedIn}`}><FolderOpenIcon style={{fontSize: '18px'}} className = 'importedLogos'/> Open </div>
                                            </button>
                                        </div>
                                        
                                    
                                </MenuItem>
                            )
                        } else {
                          return(<div key={`${group[0]}-${group[1]}`} style={{display: 'none'}}></div>)
                        }
                    })
                  }
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
  );
}