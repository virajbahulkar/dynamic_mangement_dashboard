import React, { useEffect } from 'react';
import Table from './Employees';
import Bar from './Charts/Bar';
import Orders from './Orders';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from './Charts/ChartsComponent';
import { managementDashboardData } from "../data/dummy"
const Dashboard = ({content, rows}) => {

    const { currentTab } = useStateContext()

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

    useEffect(() => {
        
    }, [])

    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
      }

      function myFunc(temp, arr) {
        let curr = {}
        const newObj = arr.map((acc) => {
            temp.data.forEach((tmp) => {
                if(tmp.field) {
                    if(typeof tmp.field === 'object' && tmp.field.dataVal) {
                        if(acc[tmp.field.dataKey].toLowerCase() === tmp.field.value) {
                            curr[tmp.field.value] = acc[tmp.field.dataVal]
                        }
                    } else if(typeof tmp.field === 'object' && !tmp.field.dataVal) {
                        curr[tmp.field.value] = acc[tmp.field.dataKey]
                    } else {
                        curr[tmp.field] = acc[tmp.field] ? acc[tmp.field] : undefined
                    }
                    
                }                   
            })
            return curr
        })
        return newObj
      }

    const getContent = (template, data) => {
        myFunc(template, data["Q1-channel_performance"])
      }

  return (
    <>
        <div className='grid  gap-2 mx-4 mt-2 md:p-0 '>
            <FilterComponent filters={content?.filterData} />
        </div>

        {rows.map((row) => (<div className='grid grid-cols-3 gap-2 mt-5 mx-4' key={row?.id}>
            {row?.dashboardContent?.quadrants &&  row?.dashboardContent?.quadrants.map((quadrant) => (
                <div className={getQuadrantsGrid(row?.dashboardContent?.numberOfQuadrants, quadrant.id)} key={quadrant?.id}>
                    {quadrant.type === "table" && <Table content={getContent(quadrant?.content?.headings, managementDashboardData)} />}
                    {quadrant.type === "chart" && <ChartsComponent config={quadrant?.config} id={`_id_${currentTab}_${row?.id}_${quadrant?.id}`} />}
                </div>
                
            ))}
        </div>))}
        
       
    </>
  );
};
export default Dashboard;
