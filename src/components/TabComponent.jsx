import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { React, useState } from 'react';
import { TabData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { Dashboard } from '../pages';
import useAxios from '../hooks/useAxios';
import { useEffect } from 'react';
import { useMemo } from 'react';

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
        <>{children}</>
      )}
    </div>
  );
}

const TabComponent = () => {
  const { filters, currentColor, currentTab, setCurrentTab, filtersButtonClick, setFiltersButtonClick } = useStateContext();
  const [apis, setApis] = useState([]);
  const [filtersForBody, setFiltersForBody] = useState({});
  const [responseDataForDashboard, setResponseDataForDashboard] = useState([]);
  const { response, error, loading } = useAxios(apis ? { apis, filtersForBody } : [])

  const setApiUrl = () => {
    const urlObj = TabData.data[currentTab]?.content?.rows.map((row) => row?.dashboardContent?.quadrants.map((quadrant) => getAPiUrlFromConfig(quadrant?.config))).flat()
    setApis(urlObj)
  }

  const getAPiUrlFromConfig = (config) => {

    if (config?.dataType && config?.apiKey) {
      const obj = {
        url: config?.apiKey,
        key: config?.dataType,
        method: 'post',
        body: {},
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      }
      return obj
    }
  }

  const isEmpty = (data) => {
    return !Object.values(data).some(x => x === null || x === '');
  }


  useEffect(() => {
    if(isEmpty(filters)) {
      setFiltersForBody({ yoy: '2023', ...filters })
      setApiUrl()
    }
    
  }, [Object.keys(filters).map(key => `${key}_${filters[key]}`).join("_")])


  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseDataForDashboard(response)
    }, 100);
  }, [response])


  useMemo(() => {
    setApiUrl()
  }, [currentTab])

  const tabStyles = (index) => {
    if (currentTab === index) {
      return {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderTop: `3px solid ${currentColor}`,
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
          {TabData.data.map((tab, index) => (
            <Tab label={tab.title} style={tabStyles(index)}
            />
          ))}
        </Tabs>
      </Box>
      {TabData.data.map((tab, index) => (
        <CustomTabPanel value={currentTab} index={index}>
          {(tab?.content && typeof tab?.content !== "string") ? <Dashboard key={`dash_${currentTab}`} content={tab.content} rows={tab.content.rows} apiData={responseDataForDashboard} filtersBasedOn={filtersForBody} /> : tab.title}
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default TabComponent;