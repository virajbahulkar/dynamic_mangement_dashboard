import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from '../components/ChartsComponent';
import { managementDashboardData } from "../data/dummy"
import { generateClasses, getQuadrantsGrid } from '../helpers';
import axios from "axios";
import useFetch from '../hooks/useFetch';

const Dashboard = ({ content, rows }) => {

    const { currentTab } = useStateContext()
    const [data, setData] = useState([]);
    const useFetchData = (url) => useFetch(url);

    const groupsBy = (group, data) => {
        if(group && data) {
            const result = Object.values?.(data?.reduce((r, o) => {
                const key = group?.map(k => o[k]).join('|');
                r[key] ??= o
                return r;
            }, {}));
            return result
        }
    }

    const getChartData = (temp, chartData) => {
        const { group } = temp || {}
        let groupData = groupsBy(group, chartData)
        return {groupData: groupData, config: temp}
    }

    const getTableData = (template, data) => {
        const { headings } = template || {}
        const response = useFetchData(template?.apiKey)
        setData(response?.data)
        console.log("response", response)
        return {headings, data}
    }


  

    const getContent = (template, type, data) => {
        let tableData, chartData
        if (type === "table") {
            if(template?.quadrantDataKey) {
                tableData = getTableData(template, data[template?.quadrantDataKey])
            } else {
                tableData = getTableData(template, data[template?.quadrantDataKey])
            }
            return tableData
            
        } else {
            if(template?.quadrantDataKey) {
                chartData = getChartData(template, data[template?.quadrantDataKey])
            } else {
                chartData = getChartData(template, data)
            }
          
            return chartData
            
        }
       

    }



    return (
        <>
            <div className='grid  gap-2 mx-4 mt-2 md:p-0 '>
                <FilterComponent filters={content.filterData} />
            </div>

            {rows.map((row) => (<div className='grid grid-cols-5 gap-3 mt-5 mx-4' key={row.id}>
                {row.dashboardContent.quadrants && row.dashboardContent.quadrants.map((quadrant) => (
                    
                    <div className={`
                            col-span-${quadrant?.span}
                            border-${quadrant?.style?.border?.width} 
                            border-${quadrant?.style?.border?.color} 
                            border-${quadrant?.style?.border?.style}
                            rounded-${quadrant?.style?.border?.radius}  
                            bg-${quadrant?.style?.background?.color} relative`
                        } key={quadrant.id}
                    >
                        {quadrant.type === "table" &&
                            <Table  
                                id={`_id_${currentTab}_${row.id}_${quadrant.id}`}
                                content={getContent(quadrant.content, quadrant.type, managementDashboardData)}
                                title={quadrant.title}
                                style={quadrant.style}
                                hasCollapse={quadrant.hasCollapse}
                                isDynamicComponent={quadrant.isDynamicComponent}
                                quadrantHeaderFields={quadrant.quadrantHeaderFields}
                            />
                        }    
                        {quadrant.type === "chart" &&
                            <ChartsComponent
                                content={getContent(quadrant.config, quadrant.type, managementDashboardData)}
                                isDynamicComponent={quadrant.isDynamicComponent}
                                style={quadrant.style}
                                hasCollapse={quadrant.hasCollapse}
                                quadrantHeaderFields={quadrant.quadrantHeaderFields}
                                id={`_id_${currentTab}_${row.id}_${quadrant.id}`}
                            />
                        }    
                    
                    </div>
        
                ))}
            </div>))}


        </>
    );
};
export default Dashboard;
