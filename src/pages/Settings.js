import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Popper from '@mui/material/Popper';
import { IoSettings } from 'react-icons/io5';
import DarkMode from '../DarkMode/DarkMode';
import LanguageContext from '../context/LanguageContext';
import translations from '../translation/Translation';
import { useSpring, animated } from '@react-spring/web';
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

  const id = open ? 'spring-popper' : undefined;

  return (
    <Box className="settings">
      <IoSettings className="settingsIcon" onClick={handleClick} />
      <Popper
        id={id}
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
            <Box style={{ padding: '10px', backgroundColor: 'white' }}>
              <Box className="title">{translate('settings')} </Box>
              <DarkMode />
              <Box style={{ display: 'flex' }}>
                <p>Language:</p>
                <Select
                  value={language}
                  onChange={(event) => toggleLanguage(event.target.value)}
                  variant="outlined"
                  style={{ backgroundColor: 'white' }}
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Settings;
