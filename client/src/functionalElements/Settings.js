import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Popper from '@mui/material/Popper';
import { IoSettings } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai'; // Import close icon
import DarkMode from '../DarkMode/DarkMode';
import LanguageContext from '../context/GlobalStatesContext';
import translations from '../translation/Translation';
import { useSpring, animated } from '@react-spring/web';
import '../style/Settings.css';
import ParticleMovement from '../particles/ParticleControlButton';
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

const Settings = () => {
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ro', label: 'Română' },
    { value: 'pl', label: 'Polski' },
  ];

  const { language, toggleLanguage } = useContext(LanguageContext);
  const translate = (key) => translations[language][key];

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id = open ? 'spring-popper' : undefined;

  return (
    <Box className="settings">
      <IoSettings className="settingsIcon" onClick={handleClick} />
      <Popper
        style={{ zIndex: 102 }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="left-start"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [-10, 15],
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
                width: '250px',
              }}
            >
              <Box className="titleSettings">
                <span className="textGlow settingsText">
                  {translate('settings')}
                </span>
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  height: '250px',
                }}
              >
                <ParticleMovement />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    color: 'var(--UIText)',
                  }}
                >
                  <p>{translate('theme')}:</p>
                  <DarkMode />
                </div>
                <Box
                  id="language"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ marginRight: '5px', color: 'var(--UIText)' }}>
                    {translate('language')}:
                  </p>
                  <Select
                    value={language}
                    onChange={(event) => toggleLanguage(event.target.value)}
                    style={{
                      backgroundColor: 'var(--UIColor)',
                      color: 'var(--UIText)',
                    }}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        style={{
                          textAlign: 'center',
                          color: 'black',
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Settings;
