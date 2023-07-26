import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from '../components/ChartsComponent';
import { managementDashboardData } from "../data/dummy"
import { generateClasses, getQuadrantsGrid } from '../helpers';
import axios from "axios";
import useFetch from '../hooks/useAxios';
import useAxios from '../hooks/useAxios';

const Dashboard = ({ content, rows }) => {

    const { currentTab } = useStateContext()
    const [api, setApi] = useState([]);
    const { response, error, loading } = useAxios(api ? api : [])

    const groupsBy = (group, data) => {
        if (group && data) {
            const result = Object.values?.(data?.reduce((r, o) => {
                const key = group?.map(k => o[k]).join('|');
                r[key] ??= o
                return r;
            }, {}));
            return result
        }
    }

    const getAPiUrlFromConfig = (config) => {
        if(config?.dataType && config?.apiKey) {
            let data = JSON.stringify({
                "flag": "ISSUANCE",
                "dim_dt": "YTD"
              });
              
              
            const obj = { 
                url: config?.apiKey, 
                key: config?.dataType, 
                method: 'post', 
                body: data,
                headers: { 
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqYWt0ZWNoIiwiaWF0IjoxNjkwMzcxNzcxLCJleHAiOjE2OTAzNzI5NzF9.fTndo_oSq5AzW8p1PeIgw8qMePoe9VoISiC9mxn3sdI', 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
            }
            return obj
        }
    }

    useEffect(() => {
        if(response) {
            console.log("response", response)
        }
    }, [response])

    const setApiUrl = (rows) => {
        const urlObj = rows.map((row) => row?.dashboardContent?.quadrants.map((quadrant) => getAPiUrlFromConfig(quadrant?.config))).flat()
        setApi(urlObj)
    }

    useEffect(() => {
        setApiUrl(rows)
    }, [])


    const getChartData = (temp, chartData) => {
        const { group } = temp || {}
        let groupData = groupsBy(group, chartData)
        return { groupData: groupData, config: temp }
    }

    const getTableData = (template, data) => {
        const { headings } = template || {}
        return { headings, data }
    }

    const getContent = (template, type, data) => {
        let tableData, chartData
        if (type === "table") {
            if (template?.quadrantDataKey) {
                tableData = getTableData(template, data[template?.quadrantDataKey])
            } else {
                tableData = getTableData(template, data[template?.quadrantDataKey])
            }
            return tableData

        } else {
            if (template?.quadrantDataKey) {
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
                <FilterComponent filters={content.filterData} style={content.filterData.style} />
            </div>

            {rows.map((row) => (<div className='grid grid-cols-5 gap-3 mt-5 mx-4' key={row.id}>
                {row.dashboardContent.quadrants && row.dashboardContent.quadrants.map((quadrant) => (

                    <div className={`${generateClasses(quadrant.style)} ${generateClasses(quadrant)} relative`
                    } key={quadrant.id}
                    >
                        {quadrant.type === "table" &&
                            <Table
                                id={`_id_${currentTab}_${row.id}_${quadrant.id}`}
                                content={getContent(quadrant.config, quadrant.type, managementDashboardData)}
                                title={quadrant.title}
                                style={quadrant.style}
                                hasCollapse={quadrant.hasCollapse}
                                filters={quadrant.config.filters}
                                showFilters={quadrant.config.showFilters}
                                isDynamicComponent={quadrant.isDynamicComponent}
                                quadrantHeaderFields={quadrant.quadrantHeaderFields}
                            />
                        }
                        {quadrant.type === "chart" &&
                            <ChartsComponent
                                content={getContent(quadrant.config, quadrant.type, managementDashboardData)}
                                isDynamicComponent={quadrant.isDynamicComponent}
                                style={quadrant.style}
                                filters={quadrant.config.filters}
                                showFilters={quadrant.config.showFilters}
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
