import React, { useEffect } from 'react';
import Table from './Employees';
import Bar from './Charts/Bar';
import Orders from './Orders';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from './Charts/ChartsComponent';
import { managementDashboardData } from "../data/dummy"
const Dashboard = ({ content, rows }) => {

    const { currentTab } = useStateContext()

    const getQuadrantsGrid = (numberOfQuadrants, quadrant) => {
        if (numberOfQuadrants === "3") {
            if (quadrant === "1") {
                return "md:p-5 bg-white rounded-3xl col-span-1"
            } else if (quadrant === "2") {
                return "md:p-5 bg-white rounded-3xl col-span-1"
            } else {
                return "md:p-5 bg-white rounded-3xl col-span-1"
            }
        } else {
            if (quadrant === "1") {
                return "md:p-5 bg-white rounded-3xl col-span-2"
            } else {
                return "md:p-5 bg-white rounded-3xl col-span-1"
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
        console.log("temp", temp)
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
            return chartData
        }

    }

    return (
        <>
            <div className='grid  gap-2 mx-4 mt-2 md:p-0 '>
                <FilterComponent filters={content.filterData} />
            </div>

            {rows.map((row) => (<div className='grid grid-cols-3 gap-2 mt-5 mx-4' key={row.id}>
                {row.dashboardContent.quadrants && row.dashboardContent.quadrants.map((quadrant) => (
                    <div className={getQuadrantsGrid(row.dashboardContent.numberOfQuadrants, quadrant.id)} key={quadrant.id}>
                        {quadrant.type === "table" &&
                            <Table
                                id={`_id_${currentTab}_${row.id}_${quadrant.id}`}
                                content={getContent(quadrant.content, quadrant.type, managementDashboardData)}
                            />}
                        {quadrant.type === "chart" &&
                            <ChartsComponent
                                content={getContent(quadrant.config, quadrant.type, managementDashboardData)}
                                id={`_id_${currentTab}_${row.id}_${quadrant.id}`}
                            />}
                    </div>

                ))}
            </div>))}


        </>
    );
};
export default Dashboard;
