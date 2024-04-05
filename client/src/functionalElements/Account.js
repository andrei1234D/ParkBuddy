import React, { useContext, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai'; // Import close icon
import GlobalStatesContext from '../context/GlobalStatesContext';

import { useSpring, animated } from '@react-spring/web';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogin } from 'react-icons/ai';
import { AiOutlineLogout } from 'react-icons/ai';

import '../style/Settings.css';

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

const Account = () => {
  const { role, username, toggleLogout, isLoggedIn, translate } =
    useContext(GlobalStatesContext);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  let popperRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (popperRef.current && !popperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    toggleLogout();
  };
  const handleLogin = () => {
    navigate('/login');
    setOpen(false);
  };
  return (
    <Box className="settings">
      <MdOutlineManageAccounts className="settingsIcon" onClick={handleClick} />
      <Popper
        ref={popperRef}
        style={{ zIndex: 100 }}
        id="spring-popper"
        open={open}
        anchorEl={anchorEl}
        transition
        placement="left-start"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 15],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box
              style={{
                padding: '10px',
                backgroundColor: 'var(--UIColor)',
                borderRadius: '5%',
                color: 'var(--UIText)',
              }}
            >
              <Box className="titleSettings">
                {isLoggedIn ? (
                  <span
                    className="textGlow settingsText"
                    style={{
                      marginRight: '25px',
                      marginLeft: '25px',
                    }}
                  >
                    {translate('accountSalute')},{username}
                  </span>
                ) : (
                  <span>{translate('accountSettings')}</span>
                )}
                <div
                  className="closeIcon"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    width: '25px',
                    height: '25px',
                  }}
                  onClick={handleClose}
                >
                  <AiOutlineClose
                    style={{
                      position: 'absolute',
                      width: '25px',
                      height: '25px',
                      top: 0,
                      right: 0,
                      color: 'var(--UIText)',
                    }}
                  />
                </div>
              </Box>
              <Box
                id="settings options"
                style={{
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {isLoggedIn ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        height: '80%',
                      }}
                    >
                      <div id="roleDiv">
                        <p>
                          {translate('loggedInA')}{' '}
                          <b style={{ fontSize: '20px' }}>{role}</b>{' '}
                          {translate('account')}
                        </p>
                      </div>
                      {role === 'customer' && (
                        <div>
                          <p>
                            {translate('loggedInA')}{' '}
                            <b style={{ fontSize: '20px' }}>
                              {translate('partner')}
                            </b>{' '}
                            {translate('account')}
                            {translate('ifUWantToLend')}
                          </p>
                          <Button>{translate(' upgradeNow')}</Button>
                        </div>
                      )}
                      {role === 'partner' && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                          }}
                        >
                          <p>{translate('lendASpotWhenever')}</p>
                          <Button
                            variant="contained"
                            style={{
                              color: 'var(--UIColor)',
                              backgroundColor: 'var(--UIText)',
                            }}
                          >
                            {translate('lend')}
                          </Button>
                        </div>
                      )}

                      {/* ADD MORE SETTINGS FOR ACCOUNT HERE */}
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleLogout}
                        style={{
                          color: 'var(--UIColor)',
                          backgroundColor: 'var(--UIText)',
                        }}
                      >
                        {translate('logout')} <AiOutlineLogout size="25px" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '80%' }}>
                      <p>{translate('accountFeatures')}</p>
                    </div>
                    <Button
                      variant="contained"
                      onClick={handleLogin}
                      style={{
                        color: 'var(--UIColor)',
                        backgroundColor: 'var(--UIText)',
                      }}
                    >
                      {translate('loginNow')}
                      <AiOutlineLogin size="25px" />
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Account;
