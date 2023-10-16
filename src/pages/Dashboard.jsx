import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import FilterComponent from '../components/FilterComponent';
import { useStateContext } from '../contexts/ContextProvider';
import ChartsComponent from '../components/ChartsComponent';
import { generateClasses } from '../helpers';
import moment from 'moment';

const Dashboard = ({ content, rows, apiData, filtersBasedOn }) => {

    const { filters, currentTab } = useStateContext()

    function generateRandomDate(from, to) {
        var dateStart = moment(from);
        var dateEnd = moment(to);
        var interim = dateStart.clone();
        var timeValues = [];

        while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
            timeValues.push(interim.format('YYYY-MM'));
            interim.add(1,'month');
        }
       return timeValues
    }

    const groupsBy = (group, data) => {
        if (group && data) {
            data.map((ele, index) => {
                return ele["yoy"] = generateRandomDate(new Date('2023-04-01'), new Date('2023-08-01'))[index]
            })
          
            const result =  Object.values?.(data?.reduce((r, o) => {
                const key = group?.map(k => o[k]).join('|');
                r[key] ??= o
                return r;
            }, {}));
          
            return result
        }
    }

    const sumAndMergeObject = (data, customKey) => {
        const result = {}; //(1)
      
        data?.forEach(basket => { //(2)
          for (let [key, value] of Object.entries(basket)) { //(3)
            if (result[key] && typeof result[key] !== 'string') { //(4)
              result[key] += value; //(5)
            } else if(key === 'channel') { //(6)
              result[key] = customKey;
            } else {
                result[key] = value
            }
          }
        });
        return result; //(7)
      };

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

        let apiObjData = []
        data?.forEach(res => {
            let key = Object.keys(res)[1]
            let fields = res[key]
            apiObjData[key] = fields
        })
        console.log("apiObjData", apiObjData)
      
        let tableData, chartData
        if (type === "table") {
            let mergedObject = {}
            if (template?.quadrantDataKey && template?.customRowConfig) {
                tableData = getTableData(template, apiObjData[template?.quadrantDataKey])
                mergedObject = sumAndMergeObject(tableData?.data, template?.customRowConfig?.key);
                
                if(tableData.data && tableData.data[tableData.data.length - 1].channel !== template?.customRowConfig?.key) {
                    tableData.data.push(mergedObject)
                }
                
            } else {
                tableData = getTableData(template, apiObjData[template?.quadrantDataKey])
            }
            return { tableData }

        } else {
            if (template?.quadrantDataKey) {
                chartData = getChartData(template, apiObjData[template?.quadrantDataKey])
            }

            return chartData

        }
    }

    return (
        <>
            <div className={`grid  gap-2 ${generateClasses(content?.filterData?.parent?.style)}`}>
                <FilterComponent filters={content.filterData} style={generateClasses(content.filterData.style)} key={`_id_${currentTab}_`} />
            </div>

            {rows.map((row) => (<div className='grid grid-cols-5 gap-3 mt-5 mx-4' key={row.id}>
                {row.dashboardContent.quadrants && row.dashboardContent.quadrants.map((quadrant) => (

                    <div className={`${generateClasses(quadrant?.style)} ${generateClasses(quadrant)} relative`
                    } key={quadrant?.id}
                    >
                        {quadrant?.type === "table" &&
                            <Table
                                id={`_id_${currentTab}_${row.id}_${quadrant?.id}`}
                                content={getContent(quadrant?.config, quadrant?.type, apiData)}
                                title={quadrant?.title}
                                style={quadrant?.style}
                                hasCollapse={quadrant?.hasCollapse}
                                filters={quadrant?.config?.filters}
                                showFilters={quadrant?.config?.showFilters}
                                headerCollapseButtonConfig={quadrant?.quadrantHeaderFields?.submitButton}
                                isDynamicComponent={quadrant?.isDynamicComponent}
                                quadrantHeaderFields={quadrant?.quadrantHeaderFields}
                                childGridConfig={quadrant?.childConfig}
                                filtersBasedOn={filtersBasedOn}
                            />
                        }
                        {quadrant?.type === "chart" &&
                            <ChartsComponent
                                content={getContent(quadrant?.config, quadrant?.type, apiData)}
                                isDynamicComponent={quadrant?.isDynamicComponent}
                                style={quadrant?.style}
                                filterBasedOn={filters}
                                chartFilters={quadrant?.config.filters}
                                showFilters={quadrant?.config.showFilters}
                                hasCollapse={quadrant?.hasCollapse}
                                quadrantHeaderFields={quadrant?.quadrantHeaderFields}
                                id={`_id_${currentTab}_${row.id}_${quadrant?.id}`}
                            />
                        }

                    </div>

                ))}
            </div>))}


        </>
    );
};
export default Dashboard;
