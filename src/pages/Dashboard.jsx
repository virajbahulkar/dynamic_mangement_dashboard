import React from 'react';
import Employees from './Employees';
import Bar from './Charts/Bar';
import Orders from './Orders';
import { TabComponent } from '../components';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
const Dashboard = () => {
  const { filters } = useStateContext()
  return (
    <>
        <div className='grid  gap-2 mx-4 mt-2 md:p-0  '>
            <TabComponent />
        </div>
        <div className='grid  gap-2 mx-4 mt-2 md:p-0  '>
            <FilterComponent />
        </div>
        <div className='grid grid-cols-8 gap-2 mt-5 mx-4'>
            <div className="  md:p-5 bg-white rounded-3xl col-span-5 ">
                <Employees />
            </div>
            <div className="   md:p-5 bg-white rounded-3xl col-span-3">
                <Bar />
            </div>
        </div>
        <div className='grid grid-cols-1 gap-2 mt-5'>
            <div className=" mx-4  md:p-5 bg-white rounded-3xl ">
                <Orders />
            </div>
        </div>
       
    </>
  );
};
export default Dashboard;
