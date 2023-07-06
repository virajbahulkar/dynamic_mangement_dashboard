import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, React } from 'react';
import { TabData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { Dashboard } from '../pages';
import { Typography } from '@mui/material';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{ children }</>
      )}
    </div>
  );
}

const TabComponent = () => {
  const { currentTab, setCurrentTab } = useStateContext();

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);

  };

  const tabStyles = (index) => {
    if (currentTab === index) {
      return {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderTop: '3px solid #EF8136',
        borderBottom: 'none',
        borderRight: '1px solid #d6d6d6',
        borderLeft: '1px solid #d6d6d6',
        fontWeight: 'bold',
        color: 'black'
      }
    } else {
      return {
        borderBottom: '1px solid #d6d6d6',
      }
    }
    return {}
  }

  return (
    <div className='grid  gap-2 mx-4 mt-2 md:p-0  '>
      <Box sx={{ maxWidth: { xs: 320, sm: 480, md: 1120 }, bgcolor: 'transparent' }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          className='md-tabs'
          color='tranparent'
          TabIndicatorProps={{
            style: { display: 'none' }
          }}
          aria-label="scrollable auto tabs example"

        >
          {TabData.map((tab, index) => (
            <Tab label={tab.title} style={tabStyles(index)}
            />
          ))}
        </Tabs>
      </Box>
      {TabData.map((tab, index) => (
        <CustomTabPanel value={currentTab} index={index}>
          {(tab?.content && typeof tab?.content !== "string") ? <Dashboard content={tab.content} /> : tab.title}
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default TabComponent;