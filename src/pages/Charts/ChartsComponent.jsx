import React from 'react';

import { ChartsHeader, LineChart, StackedBar, Bar, Pie as PieChart } from '../../components';
import ColumnBar from '../../components/Charts/ColumnBar';


const stackedBarChartData = (content) => {
        const { groupData, config } = content || {}
        let stackedChartData = []
    
        config.mapping.legends.forEach((legend, index) => {
            // groupData.data[index]["name"] = legend 
            stackedChartData.push({
                xName: 'x',
                yName: 'y',
                type: 'StackingColumn',
                name: legend,
                dataSource: groupData?.map((obj) => {
                    if(obj.channel === legend.key) {
                        return ({
                            ["x"]: obj[ config.mapping.stackedXYValues.stackedX],
                            ["y"]:  obj[ config.mapping.stackedXYValues.stackedY1],
                            ["y1"]:  obj[ config.mapping.stackedXYValues.stackedY2],
                            ["y2"]:  obj[ config.mapping.stackedXYValues.stackedY3],
                        })
                    }
            }).filter(Boolean)})
        })
        console.log("stackedChartData", stackedChartData)

        // let dataSource2 = groupData?.groupData?.map((obj) => {
        //     if(obj.flag === 'ISSUANCE') {
        //         return ({
        //             ["x"]: obj.channel,
        //             ["y"]: obj.wpi,
        //         })
        //     }
        // }).filter(Boolean)
        // stackedChartData.push(dataSource1, dataSource2)
        
        // if(stackedChartData[0] && stackedChartData[1]) {
        //     groupData.data[0]["dataSource"] = stackedChartData[0]
        //     groupData.data[1]["dataSource"] = stackedChartData[1]
        // }
       
        console.log("groupData", groupData)
        
        return stackedChartData
}

const columnBarChartData = (groupData) => {
    console.log("groupData", groupData)
        let columnChartData = []
        let dataSource1 = groupData?.groupData?.map((obj) =>  ({
            channel: obj.channel,
            wpi: obj.wpi,
            nop: obj.nop,
            ape: obj.ape,
        })).filter(Boolean)

        
        
        if(dataSource1) {
           console.log("dataSource1", dataSource1)
        }
       
        console.log("groupData", groupData)
        return groupData
}


const getChart = (config, id) => {
    let chartData

    switch (config.variant) {
        case "stacked-bar":
            chartData = stackedBarChartData(config)
            return (<StackedBar data={chartData} id={id} height={"250"} width={"500"}/>)
        case "column":
            chartData = columnBarChartData(config.data)
            return (<ColumnBar data={chartData} id={id} height={"250"}/>)
        case "bar":
            
                return (<Bar  data={chartData} id={id} />) 
        case "line":
            
            return (<LineChart data={chartData} id={id} />)         
        case "pie":
            
            return (<PieChart  data={chartData} id={id} legendVisiblity height="full" />)
        default:
            break;
    }
}

const ChartsComponent = ({content, id}) => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category="Line" title="Inflation Rate" />
    <div className="w-full" style={{overflowX: 'scroll'}}>
        {content && getChart(content, id)}
    </div>
  </div>
);

export default ChartsComponent;
