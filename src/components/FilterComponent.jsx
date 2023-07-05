import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {useState, React, useEffect} from 'react';
import { filterData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import DynamicForm from './Dynamic-Components';

const FilterComponent = () => {
  const { setFilters } = useStateContext();
    const handleSubmission = (val) => {
      setFilters(val)
    };
    
    return (
      <div style={{ backgroundColor: 'white', }} className='p-3 mt-2 flex w-full'>
        <DynamicForm fields={filterData} cbSubmit={handleSubmission} formStyle="inline" />
      </div>
    );
} 

export default FilterComponent;