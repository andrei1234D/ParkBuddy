import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Slide from '@mui/material/Slide';
import { IoSettings } from 'react-icons/io5';
import DarkMode from '../DarkMode/DarkMode';
import LanguageContext from '../context/LanguageContext';
import translations from '../translation/Translation';
import '../style/Settings.css';

const Settings = () => {
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ro', label: 'Română' },
    { value: 'pl', label: 'Polski' },
  ];

  const { language, toggleLanguage } = useContext(LanguageContext);
  const translate = (key) => translations[language][key];

  const handleLanguageChange = (event) => {
    toggleLanguage(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'right-popper' : undefined;

  const handleToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IoSettings onClick={handleToggle} className="settingsIcon" />
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
        transition
        style={{ zIndex: 1 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper>
            <Box style={{ padding: '10px' }}>
              <Box className="title">{translate('settings')} </Box>
              <DarkMode />
              <Box style={{ display: 'flex' }}>
                <p>Language:</p>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  variant="outlined"
                  className="language-selector"
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
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default Settings;
