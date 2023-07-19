import React from 'react';

import { ChartsHeader, LineChart, StackedBar, Bar, Pie as PieChart } from '../../components';
import ColumnBar from '../../components/Charts/ColumnBar';


const stackedBarChartData = (data, config) => {
    console.log("data****====", data)
        const { mapping } = config || {}
        let stackedChartData = []
        console.log("mapping=====", mapping)
        if(mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: 'StackingColumn',
                    name: legend,
                    dataSource: data?.map((obj) => obj[mapping.legends.key] === legend && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]:  obj[mapping.stackedXYValues.stackedY1],
                    })).filter(Boolean)})
            })
        }
        
        console.log("stackedChartData", stackedChartData)

        return stackedChartData
}

const columnBarChartData = (data, config) => {
    const { mapping } = config || {}
        let stackedChartData = []
        console.log("mapping=====", mapping)
        if(mapping && data) {
            mapping.legends.values.forEach((legend, index) => {
                stackedChartData.push({
                    xName: 'x',
                    yName: 'y',
                    type: 'Column',
                    name: legend,
                    dataSource: data?.map((obj) => obj[mapping.legends.key] === legend && ({
                        ["x"]: obj[mapping.stackedXYValues.stackedX],
                        ["y"]:  obj[mapping.stackedXYValues.stackedY1],
                    })).filter(Boolean)})
            })
        }
        return stackedChartData
}


const getChart = (content, id, style) => {
    const { groupData, config } = content
    console.log("config====", config)
    console.log("groupData====", groupData)
    let chartData

    switch (config.variant) {
        case "stacked-bar":
            chartData = stackedBarChartData(groupData, config)
            return (<StackedBar data={chartData} id={id} height={"250"} width={"500"} style={style} />)
        case "column":
            chartData = columnBarChartData(groupData, config)
            return (<ColumnBar data={chartData} id={id} height={"250"} width={"500"} style={style}/>)
        case "bar":
            
                return (<Bar  data={chartData} id={id} style={style} />) 
        case "line":
            
            return (<LineChart data={chartData} id={id} style={style} />)         
        case "pie":
            
            return (<PieChart  data={chartData} id={id} legendVisiblity height="full" style={style} />)
        default:
            break;
    }
}

const ChartsComponent = ({content, id}) => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category={content.config.title || content.config.chartTitle} title={`${content.config.chartTitle} - ${content.config?.mapping?.stackedXYValues.stackedY1}` || ""} />
    <div className="w-full chartWrapper" style={{overflowX: 'scroll'}}>
        {content && getChart(content, id, {overflowX: 'scroll'})}
    </div>
  </div>
);

export default ChartsComponent;
