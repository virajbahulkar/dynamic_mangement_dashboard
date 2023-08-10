import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {useState, React, useEffect} from 'react';
import { filterData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import DynamicForm from './Dynamic-Components';
import { generateClasses } from '../helpers';

const FilterComponent = (props) => {
  const { setFilters } = useStateContext();
  const { filters, onChange } = props
  const handleSubmission = (val) => {
    if(!onChange) {
      setFilters(val)
    }
    onChange(val)
  };
    
    return (
      <div  className={generateClasses(filters.style)}>
        <DynamicForm fields={filters?.fields} cbSubmit={handleSubmission} submit={filters?.submit} formStyle="inline" />
      </div>
    );
} 

export default FilterComponent;