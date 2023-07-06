import React from 'react';
import Table from './Employees';
import Bar from './Charts/Bar';
import Orders from './Orders';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from './Charts/ChartsComponent';
const Dashboard = ({content}) => {
  const { tabData } = useStateContext()

  const getQuadrantsGrid = (numberOfQuadrants, quadrant) => {
    if(numberOfQuadrants === "3") {
        if(quadrant === "1") {
            return "md:p-5 bg-white rounded-3xl col-span-1"
        } else if(quadrant === "2") {
            return "md:p-5 bg-white rounded-3xl col-span-1"
        } else {
            return "md:p-5 bg-white rounded-3xl col-span-1"
        }
    } else {
        if(quadrant === "1") {
            return "md:p-5 bg-white rounded-3xl col-span-2"
        } else {
            return "md:p-5 bg-white rounded-3xl col-span-1"
        }
    }
   
  }

  return (
    <>
        <div className='grid  gap-2 mx-4 mt-2 md:p-0 '>
            <FilterComponent filters={content?.filterData} />
        </div>

        <div className='grid grid-cols-3 gap-2 mt-5 mx-4'>
            {content?.dashboardContent?.quadrants &&  content?.dashboardContent?.quadrants.map((quadrant) => (
                <div className={getQuadrantsGrid(content?.dashboardContent?.numberOfQuadrants, quadrant.id)}>
                    {quadrant.type === "table" && <Table content={quadrant?.content} />}
                    {quadrant.type === "chart" && <ChartsComponent config={quadrant?.config} />}
                </div>
                
            ))}
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
