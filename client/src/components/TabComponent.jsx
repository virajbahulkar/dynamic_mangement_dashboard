// TabComponent.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HydratedDashboard from './HydratedDashboard';
import useHydratedPage from '../hooks/useHydratedPage';
import { useStateContext } from '../contexts/ContextProvider';
import Dashboard from '../pages/Dashboard'; // (Legacy unused when dynamic flag enabled)

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
      {value === index && <span>{children}</span>}
    </div>
  );
}

const TabComponent = () => {
  const { filters, currentColor, currentTab, setCurrentTab } = useStateContext();
  const useDynamic = process.env.REACT_APP_USE_DYNAMIC_PAGES === 'true';
  const appId = 'default';
  const slug = 'management-dashboard';
  const { page, layout, loading: pageLoading, error: pageError } = useHydratedPage(appId, slug, useDynamic);
  const layoutTabs = useDynamic ? (layout?.structure?.tabs || []) : [];
  // Legacy page layout hook removed; hydrated path handles layout.
  const [filtersForBody, setFiltersForBody] = useState({});


  const isEmpty = (data) => !Object.values(data).some((x) => x === null || x === '');

  const filtersKeys = useMemo(() => Object.keys(filters)?.map((key) => `${key}_${filters[key]}`)?.join('_'), [filters]);
  useEffect(() => {
    if (isEmpty(filters)) {
      if (filters?.yoy) setFiltersForBody(filters);
      else setFiltersForBody({ yoy: '2023', ...filters });
    }
  }, [filters, filtersKeys]);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useMemo(() => {
    setFiltersForBody({
      flag: 'ISSUANCE',
      dim_dt: 'YTD',
      lob: 'GROUP',
      yoy: '2023',
      channel: 'DIGITAL',
      premiumFilters: 'wpi',
    });
  }, []);

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
        color: 'black',
      };
    }
    return {
      borderBottom: '1px solid #d6d6d6',
    };
  };

  return (
    <div className="grid  gap-2 mx-4 mt-2 md:p-0  ">
      <Box sx={{ maxWidth: { xs: 320, sm: 480, md: 1120 }, bgcolor: 'transparent' }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          className="md-tabs"
          color="tranparent"
          TabIndicatorProps={{
            style: { display: 'none' },
          }}
          aria-label="Dashboard tabs"
          role="tablist"
        >
          {useDynamic && layoutTabs.length
            ? layoutTabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.title || tab.name || `Tab ${index+1}`}
                  style={tabStyles(index)}
                  role="tab"
                  aria-selected={currentTab === index}
                  tabIndex={currentTab === index ? 0 : -1}
                />
              ))
            : [<Tab key={0} label={pageLoading ? 'Loading...' : pageError ? 'Error' : 'Initializing'} style={tabStyles(0)} />]}
        </Tabs>
      </Box>
      {useDynamic && layoutTabs.length > 0 ? (
        layoutTabs.map((tab, index) => (
          <CustomTabPanel key={index} value={currentTab} index={index}>
            <HydratedDashboard appId={appId} slug={slug} activeTabIndex={index} tabMeta={tab} />
          </CustomTabPanel>
        ))
      ) : (
        <CustomTabPanel value={0} index={0}>
          {pageError ? `Error loading page: ${pageError.message}` : pageLoading ? 'Loading hydrated layout...' : 'Initializing...'}
        </CustomTabPanel>
      )}
    </div>
  );
};

export default TabComponent;
