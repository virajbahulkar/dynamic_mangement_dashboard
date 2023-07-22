import React from 'react';
import Table from '../components/Table';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from '../components/ChartsComponent';
import { managementDashboardData } from "../data/dummy"
import { generateClasses } from '../helpers';
const Dashboard = ({ content, rows }) => {

    const { currentTab } = useStateContext()

    const getQuadrantsGrid = (numberOfQuadrants, quadrant, quadrantSpan) => {
        if (numberOfQuadrants === "3") {
            if (quadrant === "1") {
                return ` col-span-${quadrantSpan}`
            } else if (quadrant === "2") {  
                return ` col-span-${quadrantSpan}`
            } else {
                return ` col-span-${quadrantSpan}`
            }
        } else if(numberOfQuadrants === "2") {
            if (quadrant === "1") {
                return ` col-span-${quadrantSpan}`
            } else {
                return ` col-span-${quadrantSpan}`
            }
        } else {
            if (quadrant === "1") {
                return ` col-start-1 col-end-6`
            } else {
                return ` col-span-${quadrantSpan}`
            }
        }

    }

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

    const getTableData = (headings, data) => {
        return {headings, data}
    }

    const getContent = (template, type, data) => {
        let tableData, chartData
        if (type === "table") {
            if(template?.quadrantDataKey) {
                tableData = getTableData(template?.headings, data[template?.quadrantDataKey])
            } else {
                tableData = getTableData(template?.headings, data[template?.quadrantDataKey])
            }
            return tableData
            
        } else {
            if(template?.quadrantDataKey) {
                chartData = getChartData(template, data[template?.quadrantDataKey])
            } else {
                chartData = getChartData(template, data)
            }
            console.log("chartData", chartData)
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
                    
                    <div className={generateClasses(quadrant.style)+" "+getQuadrantsGrid(row.dashboardContent.numberOfQuadrants, quadrant.id, quadrant.quadrantSpan)+" "+"relative"} key={quadrant.id}>
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
